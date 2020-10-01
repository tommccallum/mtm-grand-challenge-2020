//{{JCL-NAME}}  JOB 1,NOTIFY=&SYSUID
//***************************************************/
//COBRUN  EXEC IGYWCL
//COBOL.SYSIN  DD DSN=&SYSUID..{{COBOL-LOCATION}}({{COBOL-NAME}}),DISP=SHR
//LKED.SYSLMOD  DD DSN=&SYSUID..LOAD({{COBOL-NAME}}),DISP=SHR
//***************************************************/
// IF RC = 0 THEN
//***************************************************/
//RUN           EXEC PGM={{COBOL-NAME}}
//STEPLIB       DD DSN=&SYSUID..LOAD,DISP=SHR
//INDATA1    DD DSN={{INPUT-DATASET}},DISP=SHR
//SYSOUT        DD SYSOUT=*,OUTLIM=15000
//CEEDUMP       DD DUMMY
//SYSUDUMP      DD DUMMY
//***************************************************/
// ELSE
// ENDIF