({
	getThisContact: function(component) {
        var myID = component.get("v.recordId");
        var action = component.get("c.getContact");
        
        action.setParams({
            'id' : myID 
        });
        
        action.setCallback(this, function(actionResult) {
         component.set('v.thisContact', actionResult.getReturnValue());            
         component.set('v.mapMarkers', [
            {
                location: {
                    Street: component.get('v.thisContact.MailingAddress.street'),
                    City: component.get('v.thisContact.MailingAddress.city'),
                    PostalCode: component.get('v.thisContact.MailingAddress.postalCode'),
                    Country: component.get('v.thisContact.MailingAddress.country')
                },

                icon: 'custom:custom26',
                title: 'Mailing Address On File'
            }
        ]);
        component.set('v.markersTitle', 'Mailing Address on File');
            
        });
        $A.enqueueAction(action);

      },
    
    getBusinessAutoComplete : function(component, event, pValue_query) {
        var action = component.get("c.getBusinessAutocomplete");
        
        action.setParams({
            'input' : pValue_query
        });
        
        action.setCallback(this, function(actionResult){
            var state = actionResult.getState();
            if(state=='SUCCESS' && actionResult.getReturnValue() != '' ){
             	component.set('v.hideAutocompleteBox', "slds-dropdown slds-dropdown_length-2 slds-dropdown_fluid");
                component.set('v.autocompleteList', actionResult.getReturnValue()); 				      
          }
            else
            {
                component.set('v.hideAutocompleteBox', "slds-dropdown slds-dropdown_length-2 slds-dropdown_fluid slds-hide");
            }
        });
      
        $A.enqueueAction(action);

	},
    
    getBusinessInfo : function(component, event, pValue_query, pValue_Addr){
        var action = component.get("c.getBusinessInfo");
        
        action.setParams({
            'businessType' : pValue_query,
            'businessLocation' : pValue_Addr
        });
        
        action.setCallback(this, function(actionResult){
            var state = actionResult.getState();
            var result = actionResult.getReturnValue();
            var resultStream = [];
         
            if(state=='SUCCESS' && (result!='' || pValue_query!='') && (result!=null || pValue_query!=null))
            {
                for(var i=0; i<result.length; i++)
                {
            		resultStream.push(
                        {
                            location: {
                            City: result[i].City,
                            PostalCode: result[i].PostalCode,
                            Country: result[i].Country,
                            Street: result[i].Street
                            
                    	},
                        icon: 'custom:custom26',
                        title: result[i].Name,
                        description: 'Here is the brief summary for this place. Is this place currently closed? ' + result[i].is_closed + '. This is place has a rating of '  + result[i].Rating + ' and with its address being ' +result[i].Display_address + '. You can call them at ' + result[i].Phone + '. Be sure to replace your search query and copy the address back into the address field!'
            		});
                    
                    if(i==9) break;
                }
                
                component.set('v.mapMarkers', resultStream);
                component.set('v.markersTitle', 'Queried Results');
            }
            

            else
            {
                component.set('v.mapCenter', {
                                location: {
                                    Street: component.get('v.thisContact.MailingAddress.street'),
                                    City: component.get('v.thisContact.MailingAddress.city'),
                                    PostalCode: component.get('v.thisContact.MailingAddress.postalCode'),
                                    Country: component.get('v.thisContact.MailingAddress.country')
                                          },
                                     }
                     );
                
                component.set('v.mapMarkers', [
            	{
                	location: {
                        Street: component.get('v.thisContact.MailingAddress.street'),
                        City: component.get('v.thisContact.MailingAddress.city'),
                        PostalCode: component.get('v.thisContact.MailingAddress.postalCode'),
                        Country: component.get('v.thisContact.MailingAddress.country')
                },
                icon: 'custom:custom26',
                title: 'Mailing Address On File',
                description: component.get('v.thisContact.MailingAddress.street')
                
            }
       	 ]);
        	component.set('v.markersTitle', 'No results. Mailing Address on File');
          }
            
        });
        
        $A.enqueueAction(action);
        
    },
    
    
    scheduleMeetingSubmit: function(component, event){
        var contactID = component.get('v.recordId');
        var meetingLocation = component.find('SearchInputField').get('v.value');
        var meetingType = component.find('appointmentTypeSelect').get('v.value');
        var meetingTime = component.find('pref_dateandtime').get('v.value');
        
        var action = component.get('c.scheduleMeeting');
        
        action.setParams({
            'id' : contactID,
            'MeetingAddress' : meetingLocation,
            'MeetingTime' : meetingTime,
            'MeetingType' : meetingType
        });
        
        action.setCallback(this, function(actionResult){
            var state = actionResult.getState();
            var result = actionResult.getReturnValue();
            if(state=='SUCCESS' && (result!='' || result !=null)){
                alert("The meeting has been scheduled succesfully.");
                $A.get("e.force:closeQuickAction").fire();
                $A.get('e.force:refreshView').fire();
                
                var toastEvent = $A.get("e.force:showToast");
    			toastEvent.setParams({
        			"title": "Success!",
        			"message": "The meeting has been scheduled successfully."
   				 });

            }
            else
            {
                alert("There was an error when submitting the record. Please try again.");
            }
        });
        
        $A.enqueueAction(action);
    }
    
    
})