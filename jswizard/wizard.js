xx = {};
xx.wizard = {};

/**
 * The Wizard Object constructor.
 * @param (Object) oConfig the object to initialize the Wizard Object. It 
 * must include the following attributes:
 * (String)wizardNavigation The id of html element that used to contain navitaion links.
 * (String)wizardContent The id of html element that used to contain all wizard step elements.
 * (String)wizardController The id of html element that used to contain all controller button.
 * @return (Object) an instance of Wizard.
 */
xx.wizard.Wizard = function(oConfig) {

	// Private attributes
	
	/** The wizard navigation element. */
	var eleWizardNavigation = document.getElementById(oConfig.wizardNavigation);
	
	/** The wizard steps content element. */
	var eleWizardContent = document.getElementById(oConfig.wizardContent);
	
	/** The wizard controller element. */
	var eleWizardController = document.getElementById(oConfig.wizardController);
	
	/** All WizardSteps list. */
	var steps = new Array();
	
	/** Current selected WizardStep. */
	var curStep;
	
	/** An instance of WizardNavigation class is used to switch between steps. */
	var wizardNavigation;
	
	/** An instance of WizardController class is used to contains controller buttons. */
	var wizardController;
	
	/** The reference to current Wizard object. */
	var thiz = this;
	
	// Public methods
	
	/**
	 * Add a WizardStep to steps list.
	 * @param (Object)step An instance of WizardStep.
	 * @return (void)
	 */
	this.addStep = function(step) {
		steps.push(step)
	}
	
	/**
	 * Search an instance of WizardStep with given id of WizardStep. If cannot
	 * find return null.
	 * @param (String)stepId The id of WizardStep instance.
	 * @return (Object) An instance of WizardStep.
	 */
	this.findStep = function(stepId) {
		for (var idx = 0; idx < steps.length; idx++) {
			if (stepId == steps[idx].getId()) {
				return steps[idx];
			}
		}
		return null;
	}

	/**
	 * Get the index location of the WizardStep in step list with given id of 
	 * WizardStep instance. If cannot find it, return -1.
	 * @param (String)stepId The id of WizardStep instance.
	 * @return (int) The index location.
	 */
	this.getStepIndex = function(stepId) {
		for (var idx = 0; idx < steps.length; idx++){
			var step = steps[idx];
			if( step.getId() == stepId ) {
				return idx;
			}
		}
		return -1;
	}
	
	/**
	 * Remove all WizardStep instancs from step list.
	 * @return (void)
	 */
	this.removeAllSteps = function() {
		for (var idx = 0; idx < steps.length; idx++){
			var step = steps[idx];
			step = null;
		}
		steps = new Array();
	}
	
	/**
	 * Move to previous WizardStep.
	 * @return (void)
	 */
	this.moveToPrevious = function() {
		var idx = thiz.getStepIndex(curStep.getId());
		if( idx > 0 ) {
			var preStep = steps[idx - 1];
			thiz.moveTo(preStep.getId());
		}
	}
	
	/**
	 * Move to next WizardStep.
	 * @return (void)
	 */
	this.moveToNext = function() {
		var idx = thiz.getStepIndex(curStep.getId());
		if( idx < steps.length - 1 ) {
			var nextStep = steps[idx + 1];
			thiz.moveTo(nextStep.getId());
		}
	}
	
	/**
	 * Move to the WizardStep that has given id of WizardStep.
	 * @param (String)stepId The id of WizardStep instance.
	 * @return (void)
	 */
	this.moveTo = function(stepId) {
		var step = thiz.findStep(stepId);
		
		wizardNavigation.setSelected(step);
		wizardNavigation.refresh();
		
		wizardController.setSelected(step);
		wizardController.refresh();

		for (var i = 0; i < steps.length; i++){
			if( steps[i].getId() == stepId ) {
				steps[i].setVisible(true);
				curStep = steps[i];
			} else {
				steps[i].setVisible(false);
			}
		}
	}
	
	/**
	 * Render the wizard object to page.
	 */
	this.render = function() {
		curStep = steps[0];
		steps[0].setVisible(true);
		
		wizardNavigation = new xx.wizard.WizardNavigation({wizard: thiz, steps: steps});
		wizardNavigation.render(eleWizardNavigation);
		
		wizardController = new xx.wizard.WizardController({wizard: thiz, steps: steps});
		wizardController.render(eleWizardController);
	}

	/**
	 * A util method to generate a controller button.
	 * @param (String)id The id of button.
	 * @param (String)name The name of button.
	 * @param (String)value The value of button.
	 * @param (Function)clickHandler The callback function for click this buttion.
	 * @return (Element) An html element.
	 */
	this.generateButton = function(id, name, value, clickHandler) {
		var eleBtn = document.createElement("input");
		eleBtn.type = 'button';
		eleBtn.id = id;
		eleBtn.name = name;
		eleBtn.value = value;
		eleBtn.onclick = clickHandler;
		return eleBtn;
	}
}

xx.wizard.WizardNavigation = function(oConfig) {
	var wizard = oConfig.wizard;
	var steps = oConfig.steps;
	var selectedStep;
	var eleParent;
	
	this.render = function(ele) {
		if (eleParent == null) {
			eleParent = ele;
		}
		var eleUL = document.createElement("ul");
		if (selectedStep == null) {
			selectedStep = steps[0];
		}
		
		var selectedStepIdx = 0;
		for (var idx = 0; idx < steps.length; idx++){
			if (steps[idx].getId() == selectedStep.getId()) {
				selectedStepIdx = idx;
				break;
			}
		}
		for (var idx = 0; idx < steps.length; idx++){
			var eleLI = document.createElement("li");
			var className = ''
			if (steps[idx].getId() == selectedStep.getId()) {
				className += ' selected';
			}
			eleLI.className = className;
			var eleSpan = document.createElement("span");
			if (idx < selectedStepIdx) {
				var eleLink = document.createElement("a");
				eleLink.href = '#';
				var fnCallback = function(wizard, step) {
					return function() {
						var navigationCallback = step.getNavigationCallback();
						if (navigationCallback != null) {
							navigationCallback();
						} else {
							wizard.moveTo(step.getId());
						}
					};
				}(wizard, steps[idx]);
				eleLink.onclick = fnCallback;
				eleLink.innerHTML = steps[idx].getTitle();
				eleSpan.appendChild(eleLink);
			} else {
				eleSpan.innerHTML = steps[idx].getTitle();
			}
			eleLI.appendChild(eleSpan);
			eleUL.appendChild(eleLI);
		}
		ele.appendChild(eleUL);
	}
	
	this.refresh = function() {
		var childNodes = eleParent.childNodes;
		for(var idx = childNodes.length - 1 ; idx >= 0 ; idx-- ) {
			eleParent.removeChild(childNodes[idx]);
		}
		this.render(eleParent);
	}
	
	this.setSelected = function(oWizardStep) {
		selectedStep = oWizardStep;
	}
}

xx.wizard.WizardController = function(oConfig) {
	var wizard = oConfig.wizard;
	var steps = oConfig.steps;
	var selectedStep;
	var eleParent;
	
	this.render = function(parent) {
		eleParent = parent;
		var controlButtons = steps[0].getControlButtons();
		if (controlButtons != null) {
			for(var idx = 0; idx < controlButtons.length; idx ++) {
				eleParent.appendChild(controlButtons[idx]);
			}
		}
	}
	
	this.refresh = function() {
		var childNodes = eleParent.childNodes;
		for(var idx = childNodes.length - 1 ; idx >= 0 ; idx-- ) {
			eleParent.removeChild(childNodes[idx]);
		}
		var controlButtons = selectedStep.getControlButtons();
		if (controlButtons != null) {
			for(var idx = 0; idx < controlButtons.length; idx ++) {
				eleParent.appendChild(controlButtons[idx]);
			}
		}
	}
	
	this.setSelected = function(oWizardStep) {
		selectedStep = oWizardStep;
	}
}

/**
 * The constructor of WizardStep class.
 * @param (Object)oConfig the object to initialize the WizardStep Object. It 
 * must include the following attributes:
 * (String)id The identity id of WizardStep object
 * (String)name The id of WizardStep object.
 * (String)title The title of WizardStep object that is used to display in navigation area.
 * (Array)controlButtons The control buttons of WizardStep that are used to display in controller area.
 * (Function)navigationCallback The navigation callback function that will be used on click the step title in navigation area.
 * @return (Object) an instance of WizardStep.
 */
xx.wizard.WizardStep = function(oConfig) {
	var id = oConfig.id;
	var name = oConfig.name;
	var title = oConfig.title;
	var controlButtons = oConfig.controlButtons;
	var navigationCallback = oConfig.navigationCallback;

	this.getId = function() {
		return id;
	}
	
	this.getName = function() {
		return name;
	}
	
	this.getTitle = function() {
		return title;
	}
	
	this.isVisible = function() {
		return document.getElementById(id).style.display;
	}
	
	this.setVisible = function(visible) {
		document.getElementById(id).style.display = (visible)? 'block':'none';
	}
	
	this.getControlButtons = function() {
		return controlButtons;
	}
	
	this.getNavigationCallback = function() {
		return navigationCallback;
	}
}

