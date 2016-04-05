var app = angular.module('ngViewExample', ['ngRoute', 'ngAnimate', 'ui.router', 'ui.bootstrap', 'ngResource', 'ngCookies']);

  .controller('DBSchemaController', ['$scope', '$http', '$timeout', '$resource',
	function($scope, $http, $timeout, $resource) {	
	
	$scope.message = 'DB Schema';
	$scope.items = ['Restaurant Database','School Database'];
	$scope.selection = $scope.items[1];
	//$scope.data = "fullname, username, email address, password, role\nfullname, username, email address, password, role";
	$scope.data = "";
	$scope.column = {
		name: 'COL1',
		type: 'INT',
		nn: false,
		pk: false,
		ai: false
	};
	
	$scope.types = ['INT', 'INT(11)', 'FLOAT', 'VARCHAR(50)', 'VARCHAR(100)', 'VARCHAR(150)', 'DATE'];
	$scope.nn = false;
	$scope.pk = false;
	$scope.autoInc = false;
	
	$scope.createDB = function(dbName) {
		var DBResource = $resource('http://127.0.0.1/apiDBSchemaServices/dbCreation', {name:'name'});
		var db = DBResource.save({name:dbName})
			.$promise.then(function( db ) {
				alert("database " + dbName + " created")
		});
	};

	$scope.createTables = function() {
		var DBResource = $resource('http://127.0.0.1/apiDBSchemaServices/tableCreation', {table:'name', columns:'columns'});
		for (var i=0; i<tables.length; i++) {
			var table = DBResource.save({table:tables[i].tableName, columns:tables[i].columnNames})
				.$promise.then(function( table ) {
					console.log("db " + table + " created");
			});
		}
	};

	$scope.dropTables = function() {
		var DBResource = $resource('http://127.0.0.1/apiDBSchemaServices/tableDrop', {table:'name'});
		for (var i=0; i<tables.length; i++) {
			var table = DBResource.remove({table:tables[i].tableName})
				.$promise.then(function( table ) {
					console.log("db " + table + " deleted");
			});
		}
	};

	$scope.dropDB = function(dbName) {
		// var DBResource = $resource('http://127.0.0.1/apiDBSchemaServices/dbDrop', {name:'name'});
		// var db = DBResource.save({name:dbName})
			// .$promise.then(function( db ) {
				// console.log("database " + dbName + " deleted");
		// });
		var DBResource = $resource('http://127.0.0.1/apiDBSchemaServices/dbDrop', {name:'name'});
		var db2 = DBResource.save({name:dbName});
	};

	// $scope.addDB = function(name) {
		// $scope.data += "DB: " + name  + "\n";
	// };
	
	$scope.addTable = function(name) {
		$scope.data += "Table: " + name + "\n";
		table_entries.push({tableName: name});
	};
	
	$scope.addColumn = function(tname, column) {
		var csv = '';
		var definition = column.type;
		
		if (!column.nn) definition += " NOT NULL";
		if (column.ai) definition += " AUTO_INCREMENT";
		if (column.pk) definition += " PRIMARY KEY";
		
		// columns.push({columnName: column.name});
		// columns.push({definition: definition});
		
		table.tableName =  tname;
		table.columns.push({
			columnName: column.name,
			definition: definition
		});
		
		$scope.data = "CREATE TABLE IF NOT EXISTS  " + table.tableName + " (\n";
		for (var i=0; i<table.columns.length; i++) {
			if (i == (table.columns.length - 1)) {
				$scope.data += "\t" + table.columns[i].columnName + " " + table.columns[i].definition + "\n";
				csv += table.columns[i].columnName;
			}
			else {
				$scope.data += "\t" + table.columns[i].columnName + " " + table.columns[i].definition + ",\n";
				csv += table.columns[i].columnName + ", ";
			}
		}
		
		$scope.data += ");";
		
		$scope.data += "\n\n\nCSV: " + csv;
	};
	
	$scope.reset = function() {
		$scope.data = '';
		table = {};
		table.tableName = "";
		table.columns = [];
	};
		
	$scope.process = function() {
		var DBResource = $resource('http://127.0.0.1/apiDBSchemaServices/tableCreation', {table:'name', columns:'columns'});
		//for (var i=0; i<tables.length; i++) {
		var t = DBResource.save({table:table.tableName, columns:table.columns})
			.$promise.then(
				function( t ) {
				console.log("db " + table.tableName + " created");
			},function( t ) {
				console.log("error");
			});
		//}
	};
	
	table = {};
	table.tableName = "";
	table.columns = [];

	//columns = [];
	
	
	tables = [
		{tableName: "db.users",
			columnNames : [
				{ columnName: "id", definition: "INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY" },
				{ columnName: "name", definition: "VARCHAR(100) NOT NULL" },
				{ columnName: "username", definition: "VARCHAR(50) NOT NULL" },
				{ columnName: "password", definition: "VARCHAR(50) NOT NULL" },
				{ columnName: "emailAddress", definition: "VARCHAR(100) NOT NULL" },
				{ columnName: "role", definition: "VARCHAR(20) NOT NULL" },
			]
		},
		{tableName: "db.students",
			columnNames : [
				{ columnName: "id", definition: "INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY" },
				{ columnName: "name", definition: "VARCHAR(100) NOT NULL" },
				{ columnName: "year", definition: "INT NOT NULL" },
				{ columnName: "month", definition: "INT NOT NULL" },
				{ columnName: "day", definition: "INT NOT NULL" },
				{ columnName: "parent_id", definition: "INT NOT NULL" }
			]
		},
		{tableName: "db.classes",
			columnNames : [
				{ columnName: "id", definition: "INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY" },
				{ columnName: "name", definition: "VARCHAR(100) NOT NULL" },
				{ columnName: "number", definition: "VARCHAR(50) NOT NULL" },
			]
		},
		{tableName: "db.registration",
			columnNames : [
				{ columnName: "id", definition: "INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY" },
				{ columnName: "student_id", definition: "INT NOT NULL" },
				{ columnName: "class_id", definition: "INT NOT NULL" },
				{ columnName: "grade", definition: "INT NOT NULL" }
			]
		},
		{tableName: "db.grades",
			columnNames : [
				{ columnName: "id", definition: "INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY" },
				{ columnName: "student_id", definition: "INT NOT NULL" },
				{ columnName: "course_id", definition: "INT NOT NULL" },
				{ columnName: "mark", definition: "INT NOT NULL" }
			]
		},
		{tableName: "db.attendance",
			columnNames : [
				{ columnName: "id", definition: "INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY" },
				{ columnName: "student_id", definition: "INT NOT NULL" },
				{ columnName: "day", definition: "INT NOT NULL" }			
			]
		}
	];
	
	$scope.tables = tables;
	$scope.userColumns = tables[0].columnNames;
	
	$scope.tab = 3;

	$scope.setTab = function(newTab){
		$scope.tab = newTab;
	};

	$scope.isSet = function(tabNum){
		return $scope.tab === tabNum;
	};
	
	$scope.fill = function(data) {
		var lines; //, lineNumber, 
		var data, length;
		$scope.list = [];
		lines = data.split('\n');
		//lineNumber = 0;
		for (var i = lines.length - 1; i >= 0; i--) {
			l = lines[i];

			//lineNumber++;
			data = l.split(',');
			
			// var student = {};
			// student.fname = $scope.student.fname;
			// student.lname = $scope.student.lname;
			// student.parent_id = $scope.student.parent_id;
				
			var u = [];
			u.push({
				name : data[0],
				username : data[1],
				emailAddress : data[2],
				password : data[3],;
				role : data[4]
			});
			
			json = angular.toJson(u);
			
			$scope.list.push({
				name: data[0],
				username : data[1],
				emailAddress: data[2],
				password: data[3],
				role : data[4]
			});
			
			var DBResource = $resource('http://127.0.0.1/apiDBSchemaServices/insertUser', {user:'user'});
			var user = DBResource.save({user:u})
				.$promise.then(function( user ) {
					console.log("user " + u.name + " created")
			});
		}
	};
	
  }]);
