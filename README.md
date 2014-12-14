Dep.js
======

Javascript library to handle asynchronous dependencies in calculations or other such cases where multiple things are needed to get an end result

example:

```javascript
var d = new Dep();
sampleQuery1.get({
  success: d.addDep(),
  error: function(){
    alert("First query failed");
  }
});
sampleQuery2.get({
  success: d.addDep(),
  error: function(){
    alert("Second query failed");
  }
});
var result = d.calc(function(q1, q2){
  return q1 + q2;
});
```
