///<reference types="vss-web-extension-sdk" />

import { MessageHelper } from "./logic/messageHelper";

var actionProvider = {
    getMenuItems: (context) => {
        return [<IContributedMenuItem>{
            title: "Stories info stats",
            action: (actionContext) => {
                let workItemId = actionContext.id
                    || (actionContext.ids && actionContext.ids.length > 0 && actionContext.ids[0])
                    || (actionContext.workItemIds && actionContext.workItemIds.length > 0 && actionContext.workItemIds[0]);

                let workitemidlist = [];
                for (var id in actionContext.workItemIds)
                    workitemidlist.push(id);

                debugger;

                if (workitemidlist.length > 0) {
                    let messageHelper = new MessageHelper();
                    alert(messageHelper.format(workitemidlist));
                }
            }
        }];
    }
};

// Register context menu action provider
VSS.register(VSS.getContribution().id, actionProvider);