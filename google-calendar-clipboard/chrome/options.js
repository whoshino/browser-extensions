/*
 * Load event
 */
document.addEventListener('DOMContentLoaded', Load);

/*
 * Save event
 */
document.getElementById('saveBtn').addEventListener('click', Save);　

/*
 * Load
 */
function Load() {
    chrome.storage.local.get('name', (items) => {
        document.getElementById('name').value = items.name == void(0) ? '' : items.name;
    });
}

/*
 * Save
 */
function Save() {
    var name = document.getElementById('name').value;
    chrome.storage.local.set({
        'name': name
    });
    
    document.getElementById('saveStatus').style = '';
    document.getElementById('saveStatus').animate([{opacity: '1'}, {opacity: '0'}], 1600)
    setTimeout(function() {
        document.getElementById('saveStatus').style = 'display:none';
    }, 1500);
}
