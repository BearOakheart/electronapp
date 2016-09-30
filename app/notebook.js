const {ipcRenderer} = require('electron');
var readline = require('linebyline');

var ul = document.createElement('ul');
ul.setAttribute('id','proList');

var t, tt;

productList = [];

ipcRenderer.on('file-loaded', (event, arg)=> {
  console.log("hello");
  rl = readline('input.txt');
  rl.on('line', function(line, lineCount, byteCount){
    productList.push(line.substring(2));
    renderProductList(line.substring(2));
  });
  console.log(productList);
  //productList.forEach(renderProductList);
});

document.getElementById('renderList').appendChild(ul);


function MyCtor( bindTo ) {
    // I'll omit parameter validation here.

    Object.defineProperty(this, 'value', {
        get : function ( ) {
            return bindTo.value;
        },
        set : function ( val ) {
            bindTo.value = val;
        }
    });
}

var Person = function(firstname, lastname){
  this.firstname = firstname;
  this.lastname = lastname;
  console.log("creating new person");
};
Person.prototype.created = function(){
  window.alert("Hello, I'm " + this.firstname +" "+ this.lastname + " and I'am rather new here!")
};

var firstname = new MyCtor(document.getElementById('firstname'));
firstname.value = "etunimi";


var lastname = new MyCtor(document.getElementById('lastname'));
lastname.value = "sukunimi";

function myFunction(){

  var person1 = new Person(firstname.value, lastname.value);
  console.log("person1 is " + person1.firstname + " " + person1.lastname);
  person1.created();
  var personData = person1.firstname+ " " +person1.lastname;
  productList.push(personData);
  var index = productList.length;
  console.log(index);
  ipcRenderer.send('list-append', index, personData);
  var li = document.createElement('li');
  li.setAttribute('class','item');

  ul.appendChild(li);

  li.innerHTML= person1.firstname +" "+ person1.lastname;

  console.log(productList);
};


function renderProductList(element, index, arr) {
        var li = document.createElement('li');
        li.setAttribute('class','item');

        ul.appendChild(li);

        t = document.createTextNode(element);

        li.innerHTML=li.innerHTML + element;
    };
