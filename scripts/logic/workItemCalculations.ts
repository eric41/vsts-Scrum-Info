export class WorkItemCalculations {
    private arrayOfWorkItems = [];

    public constructor(workItems = []) {
        this.arrayOfWorkItems = workItems;
        console.log('WorkItems array: ' + JSON.stringify(workItems));
    }

    public getWorkItemsResults() {
        var storyPoints = this.getStoryPoints();
        var taskNumbers = this.getTaskEstimatedCompletedRemaining();

        return "Selected: "
            + storyPoints.storiesCount + " stories, "
            + storyPoints.nicsCount    + " NICs, "
            + taskNumbers.tasksCount   + " tasks\n"
            + "\n"
            + "Stories: "         + storyPoints.storiesPoints + " SP total\n"
            + "NICs: "            + storyPoints.nicsPoints    + " SP total\n"
            + "\n"
            + "Tasks Estimated: " + taskNumbers.estimate      + "\n"
            + "Tasks Completed: " + taskNumbers.completed     + "\n"
            + "Tasks Remaining: " + taskNumbers.remaining;
    }

    private getStoryPoints() {
        var stories = this.arrayOfWorkItems.filter(workitem => workitem.fields["System.WorkItemType"] == "User Story");
        var nics = this.arrayOfWorkItems.filter(workitem => workitem.fields["System.WorkItemType"] == "NIC");

        var storypoints = 0;
        stories.forEach(function (story, index) {
            storypoints = (+story.fields["Microsoft.VSTS.Scheduling.StoryPoints"] || 0) + storypoints;
        });

        var nicspoints = 0;
        nics.forEach(function (nic, index) {
            nicspoints = (+nic.fields["Microsoft.VSTS.Scheduling.StoryPoints"] || 0) + nicspoints;
        });

        return {
            storiesCount:  stories.length,
            storiesPoints: storypoints,
            nicsCount:     nics.length,
            nicsPoints:    nicspoints
        };
    }

    private getTaskEstimatedCompletedRemaining() {
        var tasks = this.arrayOfWorkItems.filter(workitem => workitem.fields["System.WorkItemType"] == "Task");

        var remainingwork = 0, originalestimate = 0, completedwork = 0;
        tasks.forEach(function (task, index) {
            remainingwork = (+task.fields["Microsoft.VSTS.Scheduling.RemainingWork"] || 0) + remainingwork;
            originalestimate = (+task.fields["Microsoft.VSTS.Scheduling.OriginalEstimate"] || 0) + originalestimate;
            completedwork = (+task.fields["Microsoft.VSTS.Scheduling.CompletedWork"] || 0) + completedwork;
        });

        return {
            tasksCount: tasks.length,
            estimate: originalestimate,
            completed: completedwork,
            remaining: remainingwork
        };
    }

}