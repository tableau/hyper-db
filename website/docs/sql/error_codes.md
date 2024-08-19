# Error Codes

All messages emitted by Hyper are assigned five-character error codes
that follow the SQL standard's conventions for “SQLSTATE” codes and
their corresponding extensions from
[PostgreSQL](https://www.postgresql.org/docs/current/errcodes-appendix.html).

The following table lists all the error codes defined in Hyper:

Error Code   |Description
----         |----
**Class 00** |**Successful Completion**
00000        |Successful completion
**Class 02** |**No Data (this is also a warning class per the SQL standard)**
02000        |No data
**Class 08** |**Connection Exception**
08000        |Connection exception
08001        |Fail to establish a connection
08003        |Connection does not exist
08004        |Reject to establish a connection
08006        |Connection failure
08S01        |Routing failure
08S02        |Migration failure
08P01        |Protocol violation
**Class 0A** |**Feature Not Supported**
0A000        |Feature not supported
0AS01        |Unsupported database format
0AS02        |Unsupported hyper service version
**Class 0B** |**Invalid Transaction Initiation**
0B000        |Invalid transaction initiation
**Class 21** |**Cardinality Violation**
21000        |Cardinality violation
**Class 22** |**Data Exception**
22000        |Data exception
22003        |Numeric value out of range
22004        |Null value not allowed
22007        |Invalid date time format
22008        |Date time value out of range
22011        |Substring error
22012        |Division by zero
2201B        |Invalid regular expression
2201E        |Invalid argument for log function
2201F        |Invalid argument for power function
2201G        |Invalid argument for width bucket function
22021        |Character not in repertoire
22023        |Invalid parameter value
22025        |Invalid escape sequence
22P02        |Invalid text representation
22P03        |Invalid binary representation
22P04        |Bad copy file format
**Class 23** |**Integrity Constraint Violation**
23000        |Integrity constraint violation
23502        |Not null violation
23503        |Foreign key violation
23505        |Unique violation
**Class 25** |**Invalid Transaction State**
25000        |Invalid transaction state
25001        |Active SQL transaction
25006        |Readonly SQL transaction
25P01        |No active SQL transaction
25P02        |In failed SQL transaction
**Class 26** |**Invalid SQL Statement Name**
26000        |Invalid SQL statement name
**Class 28** |**Invalid Authorization Specification**
28000        |Invalid authorization specification
28P01        |Invalid password
**Class 2B** |**Dependent Privilege Descriptors Still Exist**
2B000        |Dependent privilege descriptors still exist
2BP01        |Dependent objects still exist
**Class 34** |**Invalid Cursor Name**
34000        |Invalid cursor name
**Class 3B** |**Savepoint Exception**
3B000        |Savepoint exception
3B001        |Invalid savepoint specification
**Class 3D** |**Invalid Catalog (Database) Name**
3D000        |Invalid catalog name
**Class 3F** |**Invalid Schema Name**
3F000        |Invalid schema name
**Class 40** |**Transaction Rollback**
40000        |Transaction rollback
40001        |Serialization failure
**Class 42** |**Syntax Error or Access Rule Violation**
42000        |Syntax error or access rule violation
42501        |Insufficient privilege
42601        |Syntax error
42602        |Invalid name
42701        |Duplicate column
42703        |Undefined column
42704        |Undefined object
42710        |Duplicate object
42723        |Duplicate function
42804        |Data type mismatch
42809        |Wrong object type
42846        |Cannot coerce
42883        |Undefined function
42939        |Reserved name
42P01        |Undefined table
42P04        |Duplicate database
42P05        |Duplicate prepared statement
42P07        |Duplicate table
42P10        |Invalid column reference
42P12        |Invalid database definition
42P13        |Invalid function definition
42P16        |Invalid table definition
42P17        |Invalid object definition
42P18        |Indeterminate datatype
42P21        |Collation mismatch
**Class 53** |**Insufficient Resources**
53000        |Insufficient resources
53100        |Disk full
53200        |Unable to allocate memory
53400        |Configuration limit exceeded
53S01        |Time limit exceeded
53S02        |Memory limit exceeded
53S03        |Session memory limit exceeded
**Class 54** |**Program Limit Exceeded**
54000        |Program limit exceeded
54001        |Statement too complex
54011        |Too many columns
54023        |Too many arguments
54S01        |Value too large
**Class 55** |**Object Not In Prerequisite State**
55000        |Object not in prerequisite state
55006        |Object in use
55P02        |Can't change runtime parameter
55P03        |Lock not available
**Class 57** |**Operator Intervention**
57000        |Operator intervention
57014        |Query canceled
57P01        |Admin shutdown
57P02        |Crash shutdown
57P03        |Cannot connect now
**Class 58** |**System Error**
58000        |System error
58030        |I/O error
58P01        |Undefined file
58P02        |Duplicate file
58S01        |Undefined storage resource
**Class HY** |**General Error**
HY000        |General error
HYT00        |Timeout expired
**Class XX** |**Internal Error**
XX000        |Internal error
XX001        |Data corrupted
XXS01        |Data physically invalid
XXS0P        |Feature in pilot
