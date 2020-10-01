       IDENTIFICATION DIVISION.
       PROGRAM-ID.    {{COBOL-NAME}}.
       AUTHOR.        {{AUTHOR}}.
      *
       ENVIRONMENT DIVISION.
      *
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT IN-REC-1 ASSIGN TO INDATA1.
           

       DATA DIVISION.
       FILE SECTION.
       {{INPUT-RECORD-STRUCT}}

       WORKING-STORAGE SECTION.

       01  LASTREC         PIC X(1).
      
      * Counter must be big enough to display the value in the runtime output
       01  NUM-RECS-READ   PIC 9(16).

      ****************************************************************
      *                  PROCEDURE DIVISION                          *
      ****************************************************************
       PROCEDURE DIVISION.
      *
       A000-START.
           OPEN INPUT IN-REC-1.
           PERFORM READ-NEXT-RECORD.
           DISPLAY "# records read: " NUM-RECS-READ
           PERFORM CLOSE-STOP.
           STOP RUN.

      * Read the next record
       READ-NEXT-RECORD.
           PERFORM READ-RECORD
           PERFORM UNTIL LASTREC = 'Y'
           PERFORM READ-RECORD
           END-PERFORM.

      * Closes the file and stops
       CLOSE-STOP.
           CLOSE IN-REC-1.

      * Reads an individual customer record
       READ-RECORD.
           ADD 1 TO NUM-RECS-READ
           READ IN-REC-1
           AT END MOVE 'Y' TO LASTREC
           END-READ.

     

