
var inputIssue = document.querySelector('.text-issue');
var addBtn = document.querySelector('.add');
var issues = document.querySelector('.issues');
var options = document.querySelector('.options');

options.addEventListener('click', openOptions);
addBtn.addEventListener('click', addIssue);

function openOptions() {
    browser.runtime.openOptionsPage();
}

function onError(error) {
    console.log(error);
}

function onErrorGettingIssue(error) {
    console.log("Error: can't retrive data from server.");
    console.log(error);
}

function onErrorUpdatingIssues(){
    console.log("Error: can't retrive data from server.");
}

/* display previously-saved stored issues on startup */
initialize();

function initialize() {
    /** Load local issues */
    var gettingAllStorageItems = browser.storage.local.get(null);
    
    /** Display every issue found */
    gettingAllStorageItems.then((issues) => {

        var issuesKeys = Object.keys(issues);
        for (let issueKey of issuesKeys) {
            
            var gettingIssue = getIssue(issueKey);
            gettingIssue.then(data => {
                /** Save local copy of the issue */
                var storingIssue = browser.storage.local.set({ [data['key']] : data });
                storingIssue.then(()=> {
                    /** Show issue in the DOM */
                    displayIssue(data['key'], data['fields']['summary'], data['fields']['status']['name']);    
                }, onErrorUpdatingIssues);
            })
            .catch(error => { console.log('error!')  });
        }
    }, onError);
}


function addIssue() {  
    var issueID = inputIssue.value.toUpperCase();

    /** Load local issues */
    var gettingAllStorageItems = browser.storage.local.get(null);

    gettingAllStorageItems.then(issues => {
       
        /** Checks for duplicates */
        var issuesKeys = Object.keys(issues);
        if (issuesKeys.includes(issueID)){
            
            console.log("Already on the list!")

        }else {
            
            /** Download remote issue details */
            let gettingIssue = getIssue(issueID);
            gettingIssue.then(data => {
            
                /** Save local copy of the issue */
                var storingIssue = browser.storage.local.set({ [data['key']] : data });

                storingIssue.then(()=> {

                    /** Show issue in the DOM */
                    displayIssue(data['key'], data['fields']['summary'], data['fields']['status']['name']);    
                }, onError);

            }, onErrorGettingIssue);
        }
    });
}
 
function getIssue(issue) {
    
    var gettingOptions = browser.storage.local.get(null);
    var options = {};

    return gettingOptions
    .then(data => {
        return fetch(data.options['host']+"/rest/api/2/issue/"+issue+"?fields=status,summary,description,assignee", {
            headers: { 
                authorization: window.btoa(data.options['user']+":"+data.options['password'])
            }
        })
        //return fetch('https://run.mocky.io/v3/70c2d51c-73a9-4159-9f7f-d74bb88d6cf0')
        .then(response => response.json())
        .then(data => data);
    })
    .catch(error => {
        console.log('Error de RED!');
    });
}

function displayIssue(issue, summary, status) {

    /** Create DOM elements */
    var issueContainer = document.createElement('tr');
    var issueID = document.createElement('td');
    var issueURL = document.createElement('a');
    var issueSummary = document.createElement('td');
    var issueStatus = document.createElement('td');
    var buttonTd = document.createElement('td');
    var deleteBtn = document.createElement('button');

    /** Fill elements with data */
    issueURL.textContent = issue;
    issueSummary.textContent = summary;
    issueStatus.textContent = status;
    issueURL.setAttribute('href', 'https://google.com');
    issueContainer.setAttribute('class', 'issueContainer');
    issueID.setAttribute('class', 'issueID');
    issueSummary.setAttribute('class', 'issueSummary');
    issueStatus.setAttribute('class', 'issueStatus');
    deleteBtn.setAttribute('class', 'button delete');
    deleteBtn.textContent = 'Delete';

    /** Build issue node */
    issueID.appendChild(issueURL);
    issueContainer.appendChild(issueID);
    issueContainer.appendChild(issueSummary);
    issueContainer.appendChild(issueStatus);
    issueContainer.appendChild(buttonTd);
    buttonTd.appendChild(deleteBtn);
    issues.appendChild(issueContainer); 

    /** Bind delete on click event */
    deleteBtn.addEventListener('click',(e) => {
        const evtTgt = e.target;
        evtTgt.parentNode.parentNode.parentNode.removeChild(evtTgt.parentNode.parentNode);
        browser.storage.local.remove(issue);
    })
}
