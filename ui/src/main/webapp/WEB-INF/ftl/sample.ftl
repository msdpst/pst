<#import "/spring.ftl" as spring />

<html>
<body>

<p>Domain autowiring is: ${applicant.testStatus}</p>

<form action="" method="POST">
  Age: 
  <@spring.bind "applicant.age" /> 
  <input type="text" 
    name="${spring.status.expression}" 
    value="${spring.status.value?default("")}" /><br>
  <#list spring.status.errorMessages as error> <b>${error}</b> <br> </#list>
  <br>
  <input type="submit" value="submit"/>
</form>

</body>
</html>