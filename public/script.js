

// When loaded bind the Forms' Submit buttons
document.addEventListener('DOMContentLoaded', bindSubmitButtons);


function buildTable(){
	console.log("placeholder: building table..."); // fixme
}

// This function binds the submit buttons to make calls to APIs and populate the HTML result
function bindSubmitButtons(){
	
	document.getElementById('newEntrySubmit').addEventListener('click', function(event){
		// reference C:\Users\david\Google Drive\Education\OSU\Classes\CS290 Web Development\HW\HW06 WebAPIs\CS290_HW6WebAPIs
		console.log('new entry submitted.');

		// Validate that name is not empty
		if (document.getElementById("newEntryName").value){
			// build post data for new entry
			var postInput = {};
			postInput.name = document.getElementById("newEntryName").value;
			postInput.done = document.getElementById("newEntryDone").checked;
			postInput.due = document.getElementById("newEntryDueDate").value;

			//https://piazza.com/class/jbu2ol8jlbl3iu?cid=253
			var req = new XMLHttpRequest();
			req.open("POST", "/newEntry", true);
			req.setRequestHeader('Content-Type', 'application/json');

			req.addEventListener('load',function(){
				if (req.status >= 200 && req.status < 400){
					buildTable();
					} 
				else {
					console.log("New Entry POST unsuccessful. Request Status: " + req.status);
					}
				});

			req.send(postTextInput);

			event.preventDefault();

		} else {
			console.log("Name field blank. Entry not submitted.")
		}

        })

}