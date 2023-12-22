let updateUser = (id) => {

    let row = document.getElementById(id);
    let irudia = row.children[1].children[0].files[0];
    let izena = row.children[2].children[0].value;
    let abizena = row.children[3].children[0].value;
    let email = row.children[4].children[0].value;

    var formData = new FormData();
    formData.append('izena', izena);
    formData.append('abizena', abizena);
    formData.append('email', email);
    formData.append('avatar', irudia);


    fetch(`/users/update/${id}`, {
      method: 'PUT',
      body: formData,
    }).then(res => res.json()).then(res => {
      console.log("Fitxategi izena: " + res.filename);
      if(res.filename === undefined){
        irudi = "ezIrudi.png";
      } else {
        irudi = res.filename;
      };
      row.innerHTML=`<th scope="row">${res.id}</th>
      <td><img width="30" src="uploads/${irudi}"/></td>
      <td>${res.izena}</td>
      <td>${res.abizena}</td>
      <td>${res.email}</td>
      <td> <a onclick="deleteUser('${id}')">[x]</a> <a onclick="editUser('${id}')">[e]</a>  </td>
    `;})
}

let editUser = (id) => {
    let row = document.getElementById(id);
    let irudia = row.children[1].innerHTML;
    let izena = row.children[2].innerHTML;
    let abizena = row.children[3].innerHTML;
    let email = row.children[4].innerHTML;
    row.innerHTML = `
    <th scope="row">${id}</th>
    <td><input type="file" id="fitxategia" name="avatar"/></td>
    <td><input type="text" id="izena" value="${izena}"></td>
    <td><input type="text" id="abizena" value="${abizena}"></td>
    <td><input type="text" id="email" value="${email}"></td>
    <td> <input type="button" onclick="updateUser('${id}')" value="Save"> </td>
    `;
}

let insertUser = (user) => {
  if(user.filename === undefined){
    irudi = "ezIrudi.png";
  } else {
    irudi = user.filename;
  }

  var tableBody = document.getElementById("userTableBody");
  // Loop through each user in the JSON array

  // Create a new row and set its innerHTML based on the user data
  var newRow = tableBody.insertRow();
  newRow.setAttribute("id", user._id);
  newRow.innerHTML = `
                <th scope="row">${user.id}</th>
                <td><img width="30" src="uploads/${irudi}"/></td>
                <td>${user.izena}</td>
                <td>${user.abizena}</td>
                <td>${user.email}</td>
                <td><a onclick="deleteUser('${user._id}')">[x]</a> <a onclick="editUser('${user._id}')">[e]</a>  </td>
            `;
};

let deleteUser = (id) => {
    fetch(`/users/delete/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);  // handle the response data or action
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    let row = document.getElementById(id);
    row.parentNode.removeChild(row);
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("formularioa").addEventListener("submit", (e) => {
    e.preventDefault();
    var formData = new FormData(document.forms.namedItem("formularioa"));
    
    let user = {
        izena: e.target.izena.value,
        abizena: e.target.abizena.value,
        id: Date.now(),
        email: e.target.email.value
    }


    fetch("/users/new", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(erabiltzaile => insertUser(erabiltzaile))
         // handle the response data or action
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  // Sample JSON array of users

  fetch("/users/list")
    .then((r) => r.json())
    .then((users) => {
      console.log(users);
      // Select the table body where new rows will be appended

      users.forEach((user) => {
        insertUser(user);
      });
    });
});
