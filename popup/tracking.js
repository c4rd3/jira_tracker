
var inputIssue = document.querySelector('.text-issue');
var addBtn = document.querySelector('.add');
var issues = document.querySelector('.issues');

addBtn.addEventListener('click', addIssue);

function onError(error) {
    console.log(error);
}

/* display previously-saved stored issues on startup */
initialize();

function initialize() {
    /** Load local issues */
    var gettingAllStorageItems = browser.storage.local.get(null);
    
    /** Display every issue found */
    gettingAllStorageItems.then((results) => {
        var issuesKeys = Object.keys(results);
        for (let issueKey of issuesKeys) {
            var summary = results[issueKey]['summary'];
            var status = results[issueKey]['status'];
            displayIssue(issueKey, summary, status);
        }
    }, onError);
}

function addIssue() {  
    /** Recover issue ID */
    var issueID = inputIssue.value;
    
    /** Save issue*/
    let storeIssue = {}
    storeIssue[issueID] = {}
    storeIssue[issueID]['summary'] = 'ey que pasa';
    storeIssue[issueID]['status'] = 'blocked';
    var storingIssue = browser.storage.local.set(storeIssue);
    
    /** Show new issue */
    storingIssue.then(()=> {
        displayIssue(issueID, 'descrip', 'prueba');    
    }, onError);
    getIssue();
}
 
function getIssue() {
    fetch('https://run.mocky.io/v3/6bd7b6bb-afb9-4770-9e4f-b577a2494ae9')
    .then(response => response.json())
    .then(function(data){
        console.log(data);
        console.log(data.fields['sub-tasks'][0]['outwardIssue']['fields']['status']['name']);
        console.log(data.self);
    });
}

function displayIssue(issue, summary, status) {

    /** Crear DOM elements */
    var issueContainer = document.createElement('div');
    var issueID = document.createElement('div');
    var issueSummary = document.createElement('div');
    var issueStatus = document.createElement('div');
    var deleteBtn = document.createElement('button');

    /** Fill elements with data */
    issueID.textContent = issue;
    issueSummary.textContent = summary;
    issueStatus.textContent = status;
    deleteBtn.setAttribute('class', 'button delete');
    deleteBtn.textContent = 'remove';

    /** Build issue node */
    issueContainer.appendChild(issueID);
    issueContainer.appendChild(issueSummary);
    issueContainer.appendChild(issueStatus);
    issueContainer.appendChild(deleteBtn);
      
    issues.appendChild(issueContainer); 

    /** Bind delete on click event */
    deleteBtn.addEventListener('click',(e) => {
        const evtTgt = e.target;
        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
        browser.storage.local.remove(issue);
    })
}
