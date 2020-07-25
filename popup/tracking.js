
var inputIssue = document.querySelector('.text-issue');
var addBtn = document.querySelector('.add');
var issues = document.querySelector('.issues');

addBtn.addEventListener('click', addIssue);

function onError(error) {
    console.log(error);
}

/* display previously-saved stored notes on startup */
initialize();

function initialize() {
  var gettingAllStorageItems = browser.storage.local.get(null);
  gettingAllStorageItems.then((results) => {
    var issuesKeys = Object.keys(results);
    for (let issueKey of issuesKeys) {
      var status = results[issueKey];
      displayIssue(issueKey,status);
    }
  }, onError);
}


function addIssue() {
    
    /** Recover issue ID */
    var issueID = inputIssue.value;
    /** Guardar issue*/
    var storingIssue = browser.storage.local.set({[issueID]:'prueba'});
    
    storingIssue.then(()=> {
        displayIssue(issueID, 'prueba');    
    }, onError);
}
 

 
function removeIssue(issue) {
    
}


function displayIssue(issue, status) {
  var issueContainer = document.createElement('div');
  var issueDisplay = document.createElement('div');
  var issueStatus = document.createElement('h3');
  var deleteBtn = document.createElement('button');

  issueDisplay.textContent = issue;
  issueStatus.textContent = status;
  deleteBtn.setAttribute('class', 'button delete');
  deleteBtn.textContent = 'remove';

  issueContainer.appendChild(issueDisplay);
  issueContainer.appendChild(issueStatus);
  issueContainer.appendChild(deleteBtn);
      
  issues.appendChild(issueContainer); 

  deleteBtn.addEventListener('click',(e) => {
    const evtTgt = e.target;
    evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
    browser.storage.local.remove(issue);
  })

}
