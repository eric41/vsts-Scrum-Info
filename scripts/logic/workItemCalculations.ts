export class WorkItemCalculations {
    private arrayOfWorkItems = [];

    public constructor(workItems = []) {
        this.arrayOfWorkItems = workItems;
        console.log('WorkItems array: ' + JSON.stringify(workItems));
    }

    public getWorkItemsResults() {
        return `Selected work item ids: ${this.arrayOfWorkItems.join(", ") }`;
    }

    private getWorkItemsStoryPoints() {

    }

}