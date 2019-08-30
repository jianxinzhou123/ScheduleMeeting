({
    
    doInit: function(component, event, helper) {
        var today = $A.localizationService.formatDate(new Date(), "YYYY-MM-DD");
    	component.set('v.today', today);
        
        helper.getThisContact(component);
        component.set('v.mapMarkers', [
            {
                location: {
                    City: 'Cap-d\'Ail',
                    Country: 'France'
                },

                icon: 'custom:custom26',
                title: 'Cap-d\'Ail'
            }
        ]);
        component.set('v.markersTitle', 'Côte d\'Azur');
        
        component.set('v.mapCenter', {
                                location: {
                                    Street: component.get('v.thisContact.MailingAddress.street'),
                                    City: component.get('v.thisContact.MailingAddress.city'),
                                    PostalCode: component.get('v.thisContact.MailingAddress.postalCode'),
                                    Country: component.get('v.thisContact.MailingAddress.country')
                                          },
                                     }
                     );
        component.set('v.hideAutocompleteBox', "slds-dropdown slds-dropdown_length-2 slds-dropdown_fluid slds-hide");

      }, 
    
    makeListBoxDissapear: function(component, event)
    {
      component.set('v.hideAutocompleteBox', "slds-dropdown slds-dropdown_length-2 slds-dropdown_fluid slds-hide");
    },
    
	keyCheck : function(component, event, helper) {        
        var pValue_query = component.find('SearchInputField').get('v.value');
        var pValue_Addr = component.get('v.thisContact.MailingAddress.street') + ' ' + component.get('v.thisContact.MailingAddress.city');
		helper.getBusinessAutoComplete(component, event, pValue_query);    
	},
    
    onPressEnter : function(component, event, helper){
        if(event.which == 13){
            component.set('v.hideAutocompleteBox', "slds-dropdown slds-dropdown_length-2 slds-dropdown_fluid slds-hide");
        	var pValue_query = component.find('SearchInputField').get('v.value');
        	var pValue_Addr = component.get('v.thisContact.MailingAddress.street') + ' ' + component.get('v.thisContact.MailingAddress.city');
            if(pValue_query!=''){
            helper.getBusinessInfo(component, event, pValue_query, pValue_Addr);
            }
        }		
    },
    
    onClickAutoComplete: function(component, event, helper){
        component.set('v.hideAutocompleteBox', "slds-dropdown slds-dropdown_length-2 slds-dropdown_fluid slds-hide");
        component.find('SearchInputField').set('v.value', event.currentTarget.title);
        var pValue_query = component.find('SearchInputField').get('v.value');
        var pValue_Addr = component.get('v.thisContact.MailingAddress.street') + ' ' + component.get('v.thisContact.MailingAddress.city');
        helper.getBusinessInfo(component, event, pValue_query, pValue_Addr);
 
    },
    
     validateFields: function(component, event, helper){
         
         var timePreferred = component.find('pref_dateandtime').get('v.value');
         var action = component.get('c.isTimeOlder');
         
         action.setParams({
             'dt' : timePreferred
         });
         
        action.setCallback(this, function(actionResult){
            var isOldTime = actionResult.getReturnValue();
            
            component.find('SearchInputField').showHelpMessageIfInvalid();
            component.find('pref_dateandtime').showHelpMessageIfInvalid();
            component.find('appointmentTypeSelect').showHelpMessageIfInvalid();
             
            if(component.find('SearchInputField').get('v.value').trim() == "" || component.find('SearchInputField').get('v.value') == null)
            {
                return;
            }
             
            if(component.find('pref_dateandtime').get('v.value').trim() == "" || component.find('pref_dateandtime').get('v.value') == null)
            {
                return;
            }
             
             if(isOldTime==true){
                 alert('The time you have selected is no longer available. Please try a different time.');
                 return;
             }
             
             if(component.find('appointmentTypeSelect').get('v.value').trim() == "" || component.find('appointmentTypeSelect').get('v.value') == null)
            {
                return;
            }

            helper.scheduleMeetingSubmit(component, event);
    
       });
           $A.enqueueAction(action);
   
    }
})