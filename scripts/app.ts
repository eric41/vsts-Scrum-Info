///<reference types="vss-web-extension-sdk" />

import { MessageHelper } from "./logic/messageHelper";
import { WorkItemCalculations } from "./logic/workItemCalculations";
import Dialogs = require("VSS/Controls/Dialogs");

var actionProvider = {
    getMenuItems: (context) => {
        return [<IContributedMenuItem>{
            title: "Scrum Info",
            action: (actionContext) => {
                // Get the list of selected items on the backlog
                let workitemidlist = [];
                for (var id in actionContext.workItemIds) {
                    workitemidlist.push(actionContext.workItemIds[id]);
                }

                // REST query dependencies
                VSS.require(["VSS/Service", "TFS/WorkItemTracking/RestClient"], function (VSS_Service, TFS_Wit_WebApi) {
                    // Get the REST client
                    var witClient = VSS_Service.getCollectionClient(TFS_Wit_WebApi.WorkItemTrackingHttpClient);

                    // Present the items to the user
                    witClient.getWorkItems(workitemidlist, null, null, 0).then(
                        function (workItems) {
                            let calculations = new WorkItemCalculations(workItems);
                            alert(calculations.getWorkItemsResults());
                            
                            $("#show").click(() => {
                                Dialogs.show(Dialogs.ModalDialog, {
                                    title: "ScrumInfo",
                                    contentText: calculations.getWorkItemsResults(),
                                    buttons: null
                                });
                            });

                            /*debugger;


                            var node = document.createElement("div");
                            node.className = "velocity-chart small-chart-container";
                            node.innerText = calculations.getWorkItemsResults();

                            var node2 = document.createElement("div");
                            node2.style.position = "absolute";
                            node2.style.top = "10px";
                            node2.style.width = "100%";
                            node2.style.textAlign = "center";
                            node2.style.background = "white";
                            node2.style.fontSize = "small";
                            node2.appendChild(node);

                            var destination = document.querySelectorAll("body")[0];
                            destination.insertBefore(node2, destination.firstChild);*/
                        });
                });
                debugger;
            }
        }];
    }
};

// Register context menu action provider
VSS.register(VSS.getContribution().id, actionProvider);