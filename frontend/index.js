document.addEventListener('DOMContentLoaded', function() {

    fetch('http://localhost:5000/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
    loadHTMLTable([]);
});

//button
const addBtn = document.querySelector('#addname');
const updateBtn = document.querySelector('#update-row-btn');

//insert


addBtn.onclick = function() {
    const nameInput = document.querySelector('#name-id');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5000/insert', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ name: name })
        })
        .then(response => response.json())
        .then(data => insertRowIntoTable(data['data']));
}

//fucntion insert data into table
function insertRowIntoTable(data) {
    console.log(data);
    const table = document.querySelector('table tbody');
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (key === 'date') {
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `<td><button class="btn btn-danger" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="btn btn-warning" data-id=${data.id}>Edit</td>`;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}


document.querySelector('table tbody').addEventListener('click', function(event) {
    if (event.target.className === "btn btn-danger") {
        deleteRowById(event.target.dataset.id);
    }
    if (event.target.className === "btn btn-warning") {
        handleEditRow(event.target.dataset.id);
    }
});
//delete
function deleteRowById(id) {
    fetch('http://localhost:5000/delete/' + id, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
}

//update
function handleEditRow(id) {
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden = false;
    document.querySelector('#update-row-btn').dataset.id = id;
}

updateBtn.onclick = function() {
    const updateNameInput = document.querySelector('#update-name-input');


    console.log(updateNameInput);
    fetch('http://localhost:5000/update', {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: updateNameInput.dataset.id,
                name: updateNameInput.value
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
}




//read
function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');


    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
    }

    let tableHtml = "";

    data.forEach(function({ id, name, date }) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date).toLocaleString()}</td>`;
        tableHtml += `<td><button class="btn btn-danger" data-id=${id}>Delete</td>`;
        tableHtml += `<td><button class="btn btn-warning" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;
}