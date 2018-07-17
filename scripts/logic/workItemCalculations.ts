export class WorkItemCalculations {
    private arrayOfWorkItems = [];

    public constructor(workItems = []) {
        this.arrayOfWorkItems = workItems;
        console.log('WorkItems array: ' + JSON.stringify(workItems));
    }

    public getWorkItemsResults() {
        var storyPoints = this.getStoryPoints();
        var taskNumbers = this.getTaskEstimatedCompletedRemaining();

        return "Selected work items StoryPoints: " + storyPoints
            + ", Tasks Estimated: " + taskNumbers.originalestimate
            + ", Tasks Completed: " + taskNumbers.completedwork
            + ", Tasks Remaining: " + taskNumbers.remainingwork;
    }

    private getStoryPoints() {
        var stories = this.arrayOfWorkItems.filter(workitem => workitem.fields["System.WorkItemType"] == "User Story");

        var storypoints = 0;
        stories.forEach(function (story, index) {
            storypoints = (+story.fields["Microsoft.VSTS.Scheduling.StoryPoints"] || 0) + storypoints;
        });

        return storypoints;
    }

    private getTaskEstimatedCompletedRemaining() {
        var tasks = this.arrayOfWorkItems.filter(workitem => workitem.fields["System.WorkItemType"] == "Task");

        var remainingwork = 0, originalestimate = 0, completedwork = 0;
        tasks.forEach(function (task, index) {
            remainingwork = (+task.fields["Microsoft.VSTS.Scheduling.RemainingWork"] || 0) + remainingwork;
            originalestimate = (+task.fields["Microsoft.VSTS.Scheduling.OriginalEstimate"] || 0) + originalestimate;
            completedwork = (+task.fields["Microsoft.VSTS.Scheduling.CompletedWork"] || 0) + completedwork;
        });

        return { originalestimate, completedwork, remainingwork };
    }

}