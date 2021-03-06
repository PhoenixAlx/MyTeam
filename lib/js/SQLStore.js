var systemDB;
 
/*! Initialize the systemDB global variable. */
function initDB(){
 
 
	try {
		if (!window.openDatabase) {
			alert('not supported');
		} else {
			var shortName = 'fmaDB';
			var version = '1.0';
			var displayName = 'FMA database';
			var maxSize = 10 * 1024 * 1024; // 5MB
			var myDB = openDatabase(shortName,version,displayName,maxSize);
			createTables(myDB);
			systemDB = myDB;
			// You should have a database instance in myDB.
	 
		}
	} catch(e) {
		// Error handling code goes here.
		if (e == INVALID_STATE_ERR) {
			// Version number mismatch.
		alert("Invalid database version.");
		} else {
		alert("Unknown error "+e+".");
		}
		return;
	}
 
	// alert("Database is: "+myDB);
	 
	
}
 
function loadClubs(callback){  
		myDB = systemDB;
		clubsF ={}
		myDB.transaction(
			function (transaction) {
				var nameClub = name;
				
				var squery  = 'SELECT * from clubs  ;';
				
				// alert('loading id' +id);
				transaction.executeSql(squery, [],
					function (transaction, resultSet) {
							clubsF ={}
							var string = "";
							
							for (var i=0; i<resultSet.rows.length; i++) {
									var row = resultSet.rows.item(i);
									var club = {'idclub':row['idclub'],'name':row['name'],'dateCreation':row['dateCreation']};
									clubsF[row['name']]=club;
									
									// string = string + "ID: "+row['id']+" A_ID: "+row['tbl_a_id']+" B_ID: "+row['tbl_b_id']+"\n";
							}
							
							if (callback) callback(clubsF);
							// alert("Alias test:\n"+string);
							
					}, errorHandler);
				
			}
		);
		

}
function insertClubs(name,dateCreation,callback){

    myDB = systemDB;
    myDB.transaction(
        function (transaction) {
            
            var squery  = 'Insert into clubs (name,dateCreation) VALUES (?, ?);';
            // alert('loading id' +id);
            transaction.executeSql(squery, [name,dateCreation],nullDataHandler,errorHandler);
			if (callback) callback();
        }
    );
	
}
function updateClub(name,dateCreation,idclub,callback){

    myDB = systemDB;
    myDB.transaction(
        function (transaction) {

            var squery  = 'Update clubs SET name = ? , dateCreation = ? where idclub=?;';
            // alert('loading id' +id);
            transaction.executeSql(squery, [name,dateCreation,idclub],nullDataHandler,errorHandler);
            if (callback) callback();
			
        }
    );
	
}
function removeClub(idclub,callback){

    myDB = systemDB;
    myDB.transaction(
        function (transaction) {

            var squery  = 'DELETE FROM clubs where idclub=?;';
            // alert('loading id' +id);
            transaction.executeSql(squery, [idclub],nullDataHandler,errorHandler);
            if (callback) callback();
			
        }
    );
	
}
 
/*! This creates the database tables. */
function createTables(db){
 
 
	db.transaction(
		function (transaction) {
			transaction.executeSql('CREATE TABLE IF NOT EXISTS clubs (idclub INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, dateCreation  TEXT NOT NULL);', [], nullDataHandler, errorHandler);
            transaction.executeSql('CREATE TABLE IF NOT EXISTS members (idmember INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, idclub INTEGER NOT NULL,name TEXT NOT NULL,lastName TEXT NOT NULL, dateBorn  TEXT NOT NULL,positions  TEXT NOT NULL,numberMember  TEXT NOT NULL,dateAdmission  TEXT NOT NULL);', [], nullDataHandler, errorHandler);
		}
	);
	
 
}
 
/*! When passed as the error handler, this silently causes a transaction to fail. */
function killTransaction(transaction, error)
{
    return true; // fatal transaction error
}
 
/*! When passed as the error handler, this causes a transaction to fail with a warning message. */
function errorHandler(transaction, error)
{
    // error.message is a human-readable string.
    // error.code is a numeric error code
    console.log('Oops.  Error was '+error.message+' (Code '+error.code+')');
 
    // Handle errors here
    var we_think_this_error_is_fatal = true;
    if (we_think_this_error_is_fatal) return true;
    return false;
}
 
/*! This is used as a data handler for a request that should return no data. */
function nullDataHandler(transaction, results)
{
}
 

