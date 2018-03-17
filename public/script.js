

// When loaded bind the Forms' Submit buttons
document.addEventListener('DOMContentLoaded', bindSubmitButtons);
document.addEventListener('DOMContentLoaded', intialBuild);

function addEditForm(id, name, reps, weight, date, lbs){

	// first clear children
	var editDiv = document.getElementById("editDiv");
	editDiv.innerHTML = '';

	var newHeader = document.createElement("h1");
	newHeader.textContent = "Edit Entry";
	document.getElementById("editDiv").appendChild(newHeader);

	var newForm = document.createElement("form");

	var nameLabel = document.createElement("label");
	nameLabel.textContent = "Name: "
	var nameInput = document.createElement("input");
	nameInput.type = "text"
	nameInput.required = "true"
	nameInput.value = name;
	nameInput.id = "nameInput"
	nameLabel.appendChild(nameInput);
	newForm.appendChild(nameLabel);
	newForm.appendChild(document.createElement("br"))

	var repsLabel = document.createElement("label");
	repsLabel.textContent = "Reps: "
	var repsInput = document.createElement("input");
	repsInput.type = "number"
	repsInput.value = reps;
	repsInput.id = "repsInput"
	repsLabel.appendChild(repsInput);
	newForm.appendChild(repsLabel);
	newForm.appendChild(document.createElement("br"))

	var weightLabel = document.createElement("label");
	weightLabel.textContent = "Weight: "
	var weightInput = document.createElement("input");
	weightInput.type = "number"
	weightInput.value = weight;
	weightInput.id = "weightInput"
	weightLabel.appendChild(weightInput);
	newForm.appendChild(weightLabel);
	newForm.appendChild(document.createElement("br"))

	var dateLabel = document.createElement("label");
	dateLabel.textContent = "Date: "
	var dateInput = document.createElement("input");
	dateInput.type = "date"
	//dateInput.value = date;
	var dateMod = date.slice(0, date.indexOf("T"));
	dateInput.value = dateMod
	dateInput.id = "dateInput"
	dateLabel.appendChild(dateInput);
	newForm.appendChild(dateLabel);
	newForm.appendChild(document.createElement("br"))

	var lbsLabel = document.createElement("label");
	lbsLabel.textContent = "lbs: "
	var lbsInput = document.createElement("input");
	lbsInput.type = "checkbox"
	console.log("lbs is" + lbs)
	lbsInput.checked = lbs;
	lbsInput.id = "lbsInput"
	lbsLabel.appendChild(lbsInput);
	newForm.appendChild(lbsLabel);
	newForm.appendChild(document.createElement("br"))

	var newSubmit = document.createElement("input");
	newSubmit.type = "submit";
	newSubmit.value = "Submit Edits";
	newSubmit.id = "submitEdit";
	newSubmit.addEventListener('click', function(event){
		console.log("Edit Submit Pressed!");

		// build post data for edit entry
		var postInput = {};
		postInput.id = id
		postInput.name = document.getElementById("nameInput").value;
		postInput.reps = document.getElementById("repsInput").value;
		postInput.weight = document.getElementById("weightInput").value;
		postInput.date = document.getElementById("dateInput").value;
		postInput.lbs = document.getElementById("lbsInput").checked;

		//https://piazza.com/class/jbu2ol8jlbl3iu?cid=253
		var req = new XMLHttpRequest();
		req.open("POST", "/editEntry", true);
		req.setRequestHeader('Content-Type', 'application/json');

		req.addEventListener('load',function(){
			if (req.status >= 200 && req.status < 400){
				console.log('Edit POST Successful.');
				buildTable();
				} 
			else {
				console.log("Edit POST unsuccessful. Request Status: " + req.status);
				}
			});


		req.send(JSON.stringify(postInput));

		event.preventDefault();
	})

	newForm.appendChild(newSubmit);


	document.getElementById("editDiv").appendChild(newForm);
}


function buildTable(){

	console.log("building table..."); // fixme

	var req = new XMLHttpRequest();
	req.open("POST", "/getTable", true);
	req.setRequestHeader('Content-Type', 'application/json');

	req.addEventListener('load',function(){
		if (req.status >= 200 && req.status < 400){
			console.log('getTable POST Successful.');
			constructRows(JSON.parse(req.response));
			document.getElementById("editDiv").innerHTML ="";
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

			var newRow = document.createElement("tr");
			console.log(rows[r])
			for (var c in rows[r]){
				if (c != "id"){
					var newCell = document.createElement("td");
					newCell.textContent = rows[r][c];
					newRow.appendChild(newCell);
				}
				
			}

			// Edit button
			var editCell = document.createElement("td");
			var editCellForm = document.createElement("form");
			var editCellFormSubmit = document.createElement("input");
			editCellFormSubmit.type = "submit";
			editCellFormSubmit.value="EDIT";
			editCellFormSubmit.addEventListener('click', generateEdit(rows[r]["id"], rows[r]["name"], rows[r]["reps"], rows[r]["weight"], rows[r]["date"], rows[r]["lbs"]));
			editCellForm.appendChild(editCellFormSubmit);
			editCell.appendChild(editCellForm);
			newRow.appendChild(editCell);

			// Closure reference: http://classes.engr.oregonstate.edu/eecs/fall2015/cs290-400/content/core-content/js-functions-objects/js-scope-context.html
			function generateEdit(i, n, r, w, d, l){
				return function(xi, xn, xr, xw, xd, xl){
					return function(event){
						console.log("Entry " + xi + " edited...");
						console.log("date " + xd);

						addEditForm(xi, xn, xr, xw, xd, xl)

						event.preventDefault();
					}
				}(i, n, r, w, d, l);
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