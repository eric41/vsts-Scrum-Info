# Scrum Info 

VSS/VSTS extension that provides information on backlog items, aggregating SP, #items, work

### Version History

```
0.1.x - 1.0 MVP, functionality just works :)
	Limitations: Information appears in a popup. Tasks need to be visible and selected to be counted too.

(Future: 2.0 - Integrate the scrum info numbers in the side panel of VSS, count tasks inside PBIs without being visible)
```

# Usage

Go to the backlog, select as many PBI/tasks that you need to count (open the PBIs for the tasks to be counted), right click on any of them and select the Scrum Info option of the context menu.


# Case 

### Problem

*   In TFS is not possible to count SP, work, effort.    
*   This feature is not standard in VS, and
*   The next versions of TFS will be fully web-based.

### Solution

*   Provide a web-based Scrum Info extension 
*   to get a summary of a backlog
*	Alternative : 
     * The Scrum Power Tools for Visual Studio 2013 IDE extension, 
     * but the plugin is not updated anymore for newer VS versions

### Value

*   Less excel sheets
*   Team productivity increase
*   Get rid of the cumbersome task of counting SP
*   Get to know Roche (VS marketplace)

### Advantage

*    It's the first one to do this in TFS web,
*    It's the only available for TFS 2015/2017
*    Open to add/customize features (i.e. "NIC" pbi type)

### Channels

*    Roche TFSprod/TFStest web interface
*    Visual Studio Marketplace

### Target

*   Team member who wants to know progress 
*   SM/SPL/PO/PM/PL roles who need to calculate SP, work, capacities, velocities to plan and review sprints

### Cost

*    1 Dev, 48 innovation man-hours for this MVP 1.0 

### Revenue

* Immediate time savings on productivity for PO/SM/SPLs:
    * Half day per sprint (approx)


# Acknowledgements 

> Christopher Schleiden, Microsoft

> Javi Almendrote, Roche

# Author, Links 

> Toni Subirana, 
> DIA Common Assets
> Roche Diagnostics, SL
> http://www.roche.com

> https://github.com/tonisubi/vsts-scrum-info