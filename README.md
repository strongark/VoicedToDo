# Voiced ToDo
1. Add multiple note at a time:

 For each add new to-do command we separate it by a keyword (ex: “period” or “next item”) as following:

“add new to-do note with text go to the supermarket next item wash the car”

  => semantic break-down:
  {
    cmd:NEW,
    object:to-do,
    item[]:
    {
    ’go to the supermarket’,
    ‘wash the car’
    }
  }
	
	This will add 2 to-do item to list.

#Other useful commands:

undo: remove the last to-do item (incase speech recognition of last item is wrong)
