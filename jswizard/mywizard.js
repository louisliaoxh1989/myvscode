var wizard = null;
function init() {
	wizard = new xx.wizard.Wizard({wizardNavigation: 'divWizardNavigation', wizardContent: 'divWizardContent', wizardController: 'divWizardController'});
	var fnMoveToPrevious = function(wizard) {
		return function() {
			wizard.moveToPrevious();
		};
	}(wizard);
	var fnMoveToNext = function(wizard) {
		return function() {
			wizard.moveToNext();
		};
	}(wizard);
	var fnCancel = function() {
		alert('This is Cancel function!');
	}
	var fnFinish = function() {
		alert('This is Finish function!');
	}
	var fnSpecial = function() {
		alert('This is Special function!');
	}
	wizard.addStep(new xx.wizard.WizardStep({id: 'step1', name: 'Step 1', title: 'Step 1', 
			controlButtons: [
				wizard.generateButton('step1_cancel', 'step1_cancel', 'Cancel', fnCancel),
				wizard.generateButton('step1_next', 'step1_next', 'Next', fnMoveToNext)
			]}));
	wizard.addStep(new xx.wizard.WizardStep({id: 'step2', name: 'Step 2', title: 'Step 2', 
			navigationCallback: function(wizard) {
									return function() {
										alert("It's cool!");
										wizard.moveTo('step2');
									};
								}(wizard),
			controlButtons: [
				wizard.generateButton('step2_cancel', 'step2_cancel', 'Cancel', fnCancel),
				wizard.generateButton('step2_pre', 'step2_pre', 'Previous', fnMoveToPrevious),
				wizard.generateButton('step2_next', 'step2_next', 'Next', fnMoveToNext),
				wizard.generateButton('step2_apecial', 'step2_apecial', 'Special Button', fnSpecial)
			]}));
	wizard.addStep(new xx.wizard.WizardStep({id: 'step3', name: 'Step 3', title: 'Step 3', 
			controlButtons: [
				wizard.generateButton('step3_cancel', 'step3_cancel', 'Cancel',fnCancel),
				wizard.generateButton('step3_pre', 'step3_pre', 'Previous', fnMoveToPrevious),
				wizard.generateButton('step3_next', 'step3_next', 'Next', fnMoveToNext)
			]}));
	wizard.addStep(new xx.wizard.WizardStep({id: 'step4', name: 'Step 4', title: 'Step 4', 
			controlButtons: [
				wizard.generateButton('step4_cancel', 'step4_cancel', 'Cancel', fnCancel),
				wizard.generateButton('step4_pre', 'step4_pre', 'Previous', fnMoveToPrevious),
				wizard.generateButton('step4_next', 'step4_next', 'Next', fnMoveToNext)
			]}));
	wizard.addStep(new xx.wizard.WizardStep({id: 'step5', name: 'Step 5', title: 'Step 5', 
			controlButtons: [
				wizard.generateButton('step5_cancel', 'step5_cancel', 'Cancel', fnCancel),
				wizard.generateButton('step5_pre', 'step5_pre', 'Previous', fnMoveToPrevious),
				wizard.generateButton('step5_finish', 'step5_finish', 'Finish', fnFinish)
			]}));
	wizard.render();
}
