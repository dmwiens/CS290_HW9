

// When loaded bind the Forms' Submit buttons
document.addEventListener('DOMContentLoaded', bindSubmitButtons);
document.addEventListener('DOMContentLoaded', intialBuild);

function buildTable(){

	console.log("building table..."); // fixme

	var req = new XMLHttpRequest();
	req.open("POST", "/getTable", true);
	req.setRequestHeader('Content-Type', 'application/json');

	req.addEventListener('load',function(){
		if (req.status >= 200 && req.status < 400){
			console.log('getTable POST Successful.');
			constructRows(JSON.parse(req.response));
		} 
		else {
			console.log("getTable POST unsuccessful. Request Status: " + req.status);
		}
	});


	function constructRows(rows){

		// first clear children
		var tbody = document.getElementById("workoutTableBody");
		tbody.innerHTML = '';

		for (var r in rows) {

			//console.log(rows[r]["id"]);
			var newRow = document.createElement("tr");

			for (var c in rows[r]){
				var newCell = document.createElement("td");
				//var colID = col + 1;
				//newCell.id = rowID + "," + colID; // e.g cell 2,3 has id "2,3"
				newCell.textContent = rows[r][c];
				newRow.appendChild(newCell);
			}

			// Edit button
			var editCell = document.createElement("td");
			var editCellForm = document.createElement("form");
			var editCellFormSubmit = document.createElement("input");
			editCellFormSubmit.type = "submit";
			editCellFormSubmit.value="EDIT";
			editCellFormSubmit.addEventListener('click', generateEdit(rows[r]["id"]));
			editCellForm.appendChild(editCellFormSubmit);
			editCell.appendChild(editCellForm);
			newRow.appendChild(editCell);

			// Closure reference: http://classes.engr.oregonstate.edu/eecs/fall2015/cs290-400/content/core-content/js-functions-objects/js-scope-context.html
			function generateEdit(id){
				return function(x){
					return function(event){
						console.log("Entry " + x + " edited...");

						// build post data for edit request
						var postInput= {};
						postInput.id = x;
						
						//https://piazza.com/class/jbu2ol8jlbl3iu?cid=253
						var req = new XMLHttpRequest();
						req.open("POST", "/editEntry", true);
						req.setRequestHeader('Content-Type', 'application/json');

						req.send(JSON.stringify(postInput));
						event.preventDefault();
					}
				}(id);
			}


			// Delete button
			var newCell = document.createElement("td");
			var newCellForm = document.createElement("form");
			var newCellFormSubmit = document.createElement("input");
			newCellFormSubmit.type = "submit";
			newCellFormSubmit.value="DELETE";
			newCellFormSubmit.addEventListener('click', generateDelete(rows[r]["id"]));
			newCellForm.appendChild(newCellFormSubmit);
			newCell.appendChild(newCellForm);
			newRow.appendChild(newCell);

			// Closure reference: http://classes.engr.oregonstate.edu/eecs/fall2015/cs290-400/content/core-content/js-functions-objects/js-scope-context.html
			function generateDelete(id){
				return function(x){
					return function(event){
						console.log("Entry " + x + " deleted...");

						// build post data for deletion
						var postInput = {};
						postInput.id = x;

						//https://piazza.com/class/jbu2ol8jlbl3iu?cid=253
						var req = new XMLHttpRequest();
						req.open("POST", "/deleteEntry", true);
						req.setRequestHeader('Content-Type', 'application/json');

						req.addEventListener('load',function(){
							if (req.status >= 200 && req.status < 400){
								console.log('FE: Delete Successful. Now build table...');
								buildTable();
								} 
							else {
								console.log("FE: Delete unsuccessful. Request Status: " + req.status);
								}
							});

						req.send(JSON.stringify(postInput));
						event.preventDefault();
					}
				}(id);
			}


			document.getElementById("workoutTableBody").appendChild(newRow);
		}
	}


	//req.send(JSON.stringify(postInput));
	req.send();
	event.preventDefault();
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
			postInput.reps = document.getElementById("newEntryReps").value;
			postInput.weight = document.getElementById("newEntryWeight").value;
			postInput.date = document.getElementById("newEntryDate").value;
			postInput.lbs = document.getElementById("newEntryLbs").checked;

			//https://piazza.com/class/jbu2ol8jlbl3iu?cid=253
			var req = new XMLHttpRequest();
			req.open("POST", "/newEntry", true);
			req.setRequestHeader('Content-Type', 'application/json');

			req.addEventListener('load',function(){
				if (req.status >= 200 && req.status < 400){
					console.log('New Entry POST Successful.');
					buildTable();
					} 
				else {
					console.log("New Entry POST unsuccessful. Request Status: " + req.status);
					}
				});


			req.send(JSON.stringify(postInput));
			event.preventDefault();

		} else {
			console.log("Name field blank. Entry not submitted.")
		}

        })

}



// This function calls the buildTable function once the DOM is loaded
function intialBuild(){
	console.log("initial build...")
	buildTable();
}