export class WorkItemCalculations {
    private arrayOfWorkItems = [];

    public constructor(workItems = []) {
        this.arrayOfWorkItems = workItems;
        //console.log('WorkItems array: ' + JSON.stringify(workItems));
    }

    public getWorkItemsResults() {
        var storyPoints = this.getStoryPoints();
        //var taskNumbers = this.getTaskEstimatedCompletedRemaining();
        var backendOnlyPoints = this.getTaggedStoryPoints(["Backend"], "Frontend");
        var frontendOnlyPoints = this.getTaggedStoryPoints(["Frontend"], "Backend");
        var combinedPoints = this.getTaggedStoryPoints(["Frontend", "Backend"]);

        var formattedText = this.formatText(storyPoints, backendOnlyPoints, frontendOnlyPoints, combinedPoints);

        return formattedText;
    }

    private formatText(
        storyPoints: { storiesCount: number; storiesPoints: number; nicsCount: number; nicsPoints: number; featuresCount: number; featuresPoints: number; bugsCount: number; bugsPoints: number; }, 
        backendOnlyPoints: { storiesCount: number; storiesPoints: number; }, 
        frontendOnlyPoints: { storiesCount: number; storiesPoints: number; }, 
        combinedPoints: { storiesCount: number; storiesPoints: number; }
    ) {
        var formattedText =
            (storyPoints.storiesCount > 0 ? storyPoints.storiesCount + " Stories: " + storyPoints.storiesPoints + "sp\n" : "") +
            (storyPoints.bugsCount > 0 ? storyPoints.bugsCount + " Bugs: " + storyPoints.bugsPoints + "sp\n" : "") +
            (storyPoints.bugsCount > 0 && storyPoints.storiesCount > 0 ? "Total stories + bugs: " + (storyPoints.storiesPoints + storyPoints.bugsPoints) + "sp\n" : "");

        formattedText += "--------------------------\n";
        formattedText += (backendOnlyPoints.storiesCount > 0 ? backendOnlyPoints.storiesCount + " BE only items: " + backendOnlyPoints.storiesPoints + "sp\n" : "");
        formattedText += (frontendOnlyPoints.storiesCount > 0 ? frontendOnlyPoints.storiesCount + " FE only items: " + frontendOnlyPoints.storiesPoints + "sp\n" : "");
        formattedText += (combinedPoints.storiesCount > 0 ? combinedPoints.storiesCount + " Combined items: " + combinedPoints.storiesPoints + "sp\n" : "");

        return formattedText.length > 0 ? formattedText : "No PBIs selected";
    }

    private getTaggedStoryPoints(includeTags: string[], excludeTag: string = null) {
        var stories = this.arrayOfWorkItems.filter(
            workitem => !!workitem.fields["System.Tags"] && 
            (includeTags.every(tag => workitem.fields["System.Tags"].includes(tag)) &&
            !workitem.fields["System.Tags"].includes(excludeTag)) &&
            (workitem.fields["System.WorkItemType"] == "User Story" ||
            workitem.fields["System.WorkItemType"] == "Bug"));

        var storypoints = 0;
        stories.forEach(function (story, index) {
            storypoints = (+story.fields["Microsoft.VSTS.Scheduling.StoryPoints"] || 0) + storypoints;
        });

        return {
            storiesCount:  stories.length,
            storiesPoints: storypoints
        };
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
