export class WorkItemCalculations {
    private arrayOfWorkItems = [];

    public constructor(workItems = []) {
        this.arrayOfWorkItems = workItems;
        //console.log('WorkItems array: ' + JSON.stringify(workItems));
    }

    public getWorkItemsResults() {
        var storyPoints = this.getStoryPoints();
        var taskNumbers = this.getTaskEstimatedCompletedRemaining();

        var formattedText = this.formatText(storyPoints, taskNumbers);

        return formattedText;
    }

    private formatText(storyPoints: { storiesCount: number; storiesPoints: number; nicsCount: number; nicsPoints: number; featuresCount: number; featuresPoints: number; bugsCount: number; bugsPoints: number; }, taskNumbers: { tasksCount: number; estimate: number; completed: number; remaining: number; }) {
        var formattedText =
            (storyPoints.featuresCount > 0 ? storyPoints.featuresCount + " Features: " + storyPoints.featuresPoints + "sp\n" : "") +
            (storyPoints.storiesCount > 0 ? storyPoints.storiesCount + " Stories: " + storyPoints.storiesPoints + "sp\n" : "") +
            (storyPoints.bugsCount > 0 ? storyPoints.bugsCount + " Bugs: " + storyPoints.bugsPoints + "sp\n" : "") +
            (storyPoints.bugsCount > 0 && storyPoints.storiesCount > 0 ? "Total stories + bugs: " + (storyPoints.storiesPoints + storyPoints.bugsPoints) + "sp\n" : "") +
            (storyPoints.nicsCount > 0 ? storyPoints.nicsCount + " NICs: " + storyPoints.nicsPoints + "sp\nTotal stories + NICs: " + (storyPoints.nicsPoints + storyPoints.storiesPoints) + "sp\n" : "");

        if (taskNumbers.tasksCount > 0) {
            formattedText += "--------------------------\n" 
                + taskNumbers.tasksCount + " Tasks:\n"  
                + "Estimated: " + taskNumbers.estimate + "\n"
                + "Completed: " + taskNumbers.completed + "\n"
                + "Remaining: " + taskNumbers.remaining;
        }

        return formattedText.length > 0 ? formattedText : "No PBIs selected";
    }

    private getStoryPoints() {
        var stories = this.arrayOfWorkItems.filter(
            workitem => workitem.fields["System.WorkItemType"] == "User Story" ||
            (workitem.fields["System.WorkItemType"] == "Product Backlog Item" && workitem.fields["Roche.DP.VSTS.Complexity"] == "Story"));
        var nics = this.arrayOfWorkItems.filter(workitem => workitem.fields["System.WorkItemType"] == "NIC");
        var features = this.arrayOfWorkItems.filter(workitem => workitem.fields["System.WorkItemType"] == "Feature" ||
            (workitem.fields["System.WorkItemType"] == "Product Backlog Item" && workitem.fields["Roche.DP.VSTS.Complexity"] == "Feature"));
        var bugs = this.arrayOfWorkItems.filter(workitem => workitem.fields["System.WorkItemType"] == "Bug");

        var storypoints = 0;
        stories.forEach(function (story, index) {
            storypoints = (+story.fields["Microsoft.VSTS.Scheduling.StoryPoints"] || 0) + storypoints;
        });

        var nicspoints = 0;
        nics.forEach(function (nic, index) {
            nicspoints = (+nic.fields["Microsoft.VSTS.Scheduling.StoryPoints"] || 0) + nicspoints;
        });

        var featpoints = 0;
        features.forEach(function (feature, index) {
            featpoints = (+feature.fields["Microsoft.VSTS.Scheduling.StoryPoints"] || 0) + featpoints;
        });
        
        var bugpoints = 0;
        bugs.forEach(function (bug, index) {
            bugpoints = (+bug.fields["Microsoft.VSTS.Scheduling.StoryPoints"] || 0) + bugpoints;
        });

        return {
            storiesCount:  stories.length,
            storiesPoints: storypoints,
            nicsCount:     nics.length,
            nicsPoints: nicspoints,
            featuresCount: features.length,
            featuresPoints: featpoints,
            bugsCount: bugs.length,
            bugsPoints: bugpoints
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
