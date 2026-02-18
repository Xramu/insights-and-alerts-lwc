/**
 * @description Service class for Insights and Alerts LWC data access.
 * Provides @AuraEnabled methods to fetch Insight_and_Alert__c records
 * and update Completed__c in bulk with proper sharing and FLS checks.
 *
 * Security:
 * - with sharing to respect org sharing
 * - FLS checks for readable/writable fields
 *
 * Notes:
 * - Client filters by Context__c in LWC per requirement
 * - Bulk-safe update accepting a list of Id -> Completed__c states
 */
public with sharing class InsightsAlertsService {
    public class UpdateRequest {
        @AuraEnabled public Id recordId { get; set; }
        @AuraEnabled public Boolean completed { get; set; }
    }

    /**
     * @description Get all Insight_and_Alert__c records for display.
     * Fields: Id, Topic__c, Context__c, Rationale__c, Details__c, Open_Record__c, Completed__c, Suggested_Action__c
     */
    @AuraEnabled(cacheable=false)
    public static List<Insight_and_Alert__c> getAllInsights() {
        // FLS: check at least read access on key fields; use WITH SECURITY_ENFORCED to enforce at row/field level
        // Note: RTA (Details__c) retrieved safely via SECURITY_ENFORCED.
        return [
            SELECT Id,
                   Topic__c,
                   Context__c,
                   Rationale__c,
                   Details__c,
                   Open_Record__c,
                   Completed__c,
                   Suggested_Action__c
            FROM Insight_and_Alert__c
            WITH SECURITY_ENFORCED
            ORDER BY CreatedDate DESC
        ];
    }

    /**
     * @description Update Completed__c for a set of records. Bulkified.
     * @param updates List of UpdateRequest with id and completed boolean
     * @return List<Id> of successfully updated record Ids
     */
    @AuraEnabled
    public static List<Id> updateCompleted(List<UpdateRequest> updates) {
        if (updates == null || updates.isEmpty()) {
            throw new AuraHandledException('Invalid input for updating completion states for insights!');
        }

        // Collect Ids and desired states
        Map<Id, Boolean> desired = new Map<Id, Boolean>();
        for (UpdateRequest ur : updates) {
            if (ur != null && ur.recordId != null && ur.completed != null) {
                desired.put(ur.recordId, ur.completed);
            }
        }
        if (desired.isEmpty()) {
            throw new AuraHandledException('Failed to find any valid sets of updatable data for insight completion states!');
        }

        // Query existing records with FLS + sharing
        List<Insight_and_Alert__c> toUpdate = [
            SELECT Id, Completed__c
            FROM Insight_and_Alert__c
            WHERE Id IN :desired.keySet()
            WITH SECURITY_ENFORCED
        ];

        // Check field write access for Completed__c
        if (!Schema.sObjectType.Insight_and_Alert__c.fields.Completed__c.isUpdateable()) {
            // If no write access, return empty (alternatively throw an exception)
            throw new AuraHandledException('No permissions to write into Insight_and_Alert__c field Completed__c!');
        }

        for (Insight_and_Alert__c rec : toUpdate) {
            Boolean target = desired.get(rec.Id);
            if (target != null && rec.Completed__c != target) {
                rec.Completed__c = target;
            }
        }

        if (!toUpdate.isEmpty()) {
            Database.SaveResult[] results = Database.update(toUpdate, false);
            List<Id> successIds = new List<Id>();
            for (Integer i = 0; i < results.size(); i++) {
                if (results[i].isSuccess()) {
                    successIds.add(toUpdate[i].Id);
                }
            }
            return successIds;
        }
        return new List<Id>();
    }
}
