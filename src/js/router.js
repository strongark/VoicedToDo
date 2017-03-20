
function CommandRouter(app) {
    this.app = app;
}

CommandRouter.prototype.route = function (commandText, confidence) {
    /*
    Implement voice command handling logic here.
    */
    //check the confidence. if it drop < 90%, should not proceed
    if (confidence<0.4) {
      $.notify('Command may not be recognized correctly. Please find more quite place and try again (confidence:'+confidence+')', "error");
      return;
    }
    //process the text message
    var parsedCommand = parseCommand(commandText);
    if(parsedCommand.command!='NaN')
    {
      if (parsedCommand.extra[0]=='') {
        $.notify("Note content is empty. Try adding \'with text\' before note content", "warn");
      }
      else {
        executeCommand(parsedCommand);
      }
    }
    else {
      $.notify("Received voice command is not recognized: ["+ commandText+"]", "error");
    }

};

function tokenizeString(str) {
  /* separate string to words
    in this simple problem, just use blank space to separate string
  */
  var res=str.split(" ");
  return res;
};

function buildCommandDictionary(){

  var addCmds=[["add","NEW"],["make","NEW"],["create","NEW"],["new","NEW"]];
  var cmdMap= new Map(addCmds);
  //add possible undo command
  var undoCmd=["undo","UNDO"];
  cmdMap.set(undoCmd[0],undoCmd[1]);
  return cmdMap;
}

function parseCommand(commandText) {
/*
  Analyze the semantic of the command into 3 part:
    - Command
    - Object
    - Extra[]
*/
  var parsedCommand = new Object();

  //command should start with a verb
  //possible add new note command:
  var cmdMap= buildCommandDictionary();

  var tokenizedStr=tokenizeString(commandText);

  if(cmdMap.has(tokenizedStr[0]))
  {
    parsedCommand.command=cmdMap.get(tokenizedStr[0]);
  }
  else {
    parsedCommand.command='NaN';
  }
  //should be more complicated NLP, but in this scope of todo application
  //the only object is todo so let's hardcode for now
  parsedCommand.object='todo';
  /*parse the note content from the string, separating text:
    'with text', 'as'
  */

  var contentDelimiter=['with text','as'];
  var noteString="";
  for(i=0;i<contentDelimiter.length;i++){
    var contentStr=commandText.split(contentDelimiter[i]);
    if(contentStr.length==2)//succesfully parsed
    {
      noteString=contentStr[1];
      break;
    }
  }
  //delimit noteString into many note items
  var noteDelimiter='next item';
  parsedCommand.extra=noteString.split(noteDelimiter);

  return parsedCommand;
}

function executeCommand(parsedCommand){
  /*
   execute command, structure of cmd should be:
   - Command
   - Object
   - Extra[]
  */
  switch (parsedCommand.command) {
    case 'NEW':
      this.app.addTodoList(parsedCommand.extra);
      break;
    case 'UNDO'://remove the last row from list
      this.app.deleteLastTodo();
        break;
    default:
      $.notify('Command ['+parsedCommand.command+'] not supported','error');
  }
}
