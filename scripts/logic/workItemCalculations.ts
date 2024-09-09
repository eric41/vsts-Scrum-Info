export class WorkItemCalculations {
    private arrayOfWorkItems = [];

    public constructor(workItems = []) {
        this.arrayOfWorkItems = workItems;
        //console.log('WorkItems array: ' + JSON.stringify(workItems));
    }

    public getWorkItemsResults() {
        var storyPoints = this.getStoryPoints();
        var backendOnlyPoints = this.getTaggedStoryPoints(["Backend"], ["Frontend"]);
        var frontendOnlyPoints = this.getTaggedStoryPoints(["Frontend"], ["Backend"]);
        var combinedPointsLegacy = this.getTaggedStoryPoints(["Frontend", "Backend"], []);
        var otherPointsLegacy = this.getTaggedStoryPoints([], ["Frontend", "Backend"]);
        var combinedPoints = this.getSplitStoryPoints();
        var backendPoints = {
            storiesCount: backendOnlyPoints.storiesCount + combinedPoints.storiesCount,
            storiesPoints: backendOnlyPoints.storiesPoints + combinedPoints.bePoints,
        };
        var frontendPoints = {
            storiesCount: frontendOnlyPoints.storiesCount + combinedPoints.storiesCount,
            storiesPoints: frontendOnlyPoints.storiesPoints + combinedPoints.fePoints
        };
        var otherPoints = {
            storiesCount: otherPointsLegacy.storiesCount + combinedPoints.storiesCount,
            storiesPoints: otherPointsLegacy.storiesPoints + combinedPoints.otherPoints
        }

        var formattedText = this.formatText(
            storyPoints, 
            backendPoints,
            frontendPoints, 
            combinedPointsLegacy,
            backendOnlyPoints,
            frontendOnlyPoints,
            otherPoints
        );

        return formattedText;
    }

    private formatText(
        storyPoints: { storiesCount: number; storiesPoints: number; bugsCount: number; bugsPoints: number; }, 
        backendPoints: { storiesCount: number; storiesPoints: number; }, 
        frontendPoints: { storiesCount: number; storiesPoints: number; },
        combinedPointsLegacy: { storiesCount: number; storiesPoints: number; },
        backendOnlyPoints: { storiesCount: number; storiesPoints: number; }, 
        frontendOnlyPoints: { storiesCount: number; storiesPoints: number; }, 
        otherPoints: { storiesCount: number; storiesPoints: number; }
    ) {
        var formattedText =
            (storyPoints.storiesCount > 0 ? storyPoints.storiesCount + " Stories: " + storyPoints.storiesPoints + "sp\n" : "") +
            (storyPoints.bugsCount > 0 ? storyPoints.bugsCount + " Bugs: " + storyPoints.bugsPoints + "sp\n" : "") +
            (storyPoints.bugsCount > 0 && storyPoints.storiesCount > 0 ? "Total stories + bugs: " + (storyPoints.storiesPoints + storyPoints.bugsPoints) + "sp\n" : "");

        formattedText += "--------------------------\n";

        if (
            (backendPoints.storiesCount == 0 && frontendPoints.storiesCount == 0) ||
            (storyPoints.storiesPoints + storyPoints.bugsPoints != backendPoints.storiesPoints + frontendPoints.storiesPoints + otherPoints.storiesPoints)
        ) {
            formattedText += (backendOnlyPoints.storiesCount > 0 ? backendOnlyPoints.storiesCount + " BE only items: " + backendOnlyPoints.storiesPoints + "sp\n" : "");
            formattedText += (frontendOnlyPoints.storiesCount > 0 ? frontendOnlyPoints.storiesCount + " FE only items: " + frontendOnlyPoints.storiesPoints + "sp\n" : "");
            formattedText += (combinedPointsLegacy.storiesCount > 0 ? combinedPointsLegacy.storiesCount + " Combined items: " + combinedPointsLegacy.storiesPoints + "sp\n" : "");
        } else {
            formattedText += (backendPoints.storiesCount > 0 ? backendPoints.storiesCount + " BE items: " + backendPoints.storiesPoints + "sp\n" : "");
            formattedText += (frontendPoints.storiesCount > 0 ? frontendPoints.storiesCount + " FE items: " + frontendPoints.storiesPoints + "sp\n" : "");    
        }

        formattedText += (otherPoints.storiesPoints > 0 ? otherPoints.storiesCount + " Other items: " + otherPoints.storiesPoints + "sp\n" : "");    

        return formattedText.length > 0 ? formattedText : "No PBIs selected";
    }

    private getSplitStoryPoints() {
        var combinedStories = this.arrayOfWorkItems.filter(
            workitem => !!workitem.fields["Custom.BESPSplit"] &&
            !!workitem.fields["Custom.FESPSplit"] &&
            (workitem.fields["System.WorkItemType"] == "User Story" ||
            workitem.fields["System.WorkItemType"] == "Bug"));

        var beSp = 0;
        var feSp = 0;
        var otherSp = 0;
        combinedStories.forEach(function (story) {
            beSp += story.fields["Custom.BESPSplit"];
            feSp += story.fields["Custom.FESPSplit"];
            if (story.fields["Microsoft.VSTS.Scheduling.StoryPoints"] > story.fields["Custom.BESPSplit"] + story.fields["Custom.FESPSplit"]) {
                otherSp += story.fields["Microsoft.VSTS.Scheduling.StoryPoints"] - (story.fields["Custom.BESPSplit"] + story.fields["Custom.FESPSplit"]);
            }
        })

        return {
            storiesCount: combinedStories.length,
            bePoints: beSp,
            fePoints: feSp,
            otherPoints: otherSp
        };
    }

    private getTaggedStoryPoints(includeTags: string[], excludeTags: string[]) {
        var stories = this.arrayOfWorkItems.filter(
            workitem => !!workitem.fields["System.Tags"] && 
            (includeTags.every(tag => workitem.fields["System.Tags"].includes(tag)) &&
            (!excludeTags.some(tag => workitem.fields["System.Tags"].includes(tag)))) &&
            (workitem.fields["System.WorkItemType"] == "User Story" ||
            workitem.fields["System.WorkItemType"] == "Bug"));

        var storypoints = 0;
        stories.forEach(function (story) {
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
        var bugs = this.arrayOfWorkItems.filter(workitem => workitem.fields["System.WorkItemType"] == "Bug");

        var storypoints = 0;
        stories.forEach(function (story) {
            storypoints = (+story.fields["Microsoft.VSTS.Scheduling.StoryPoints"] || 0) + storypoints;
        });

        var bugpoints = 0;
        bugs.forEach(function (bug) {
            bugpoints = (+bug.fields["Microsoft.VSTS.Scheduling.StoryPoints"] || 0) + bugpoints;
        });

        return {
            storiesCount:  stories.length,
            storiesPoints: storypoints,
            bugsCount: bugs.length,
            bugsPoints: bugpoints
        };
    }
}
 