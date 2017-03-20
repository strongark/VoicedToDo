
var app = new Vue({
    el: '#app',
    data: {
        projects: [],
        commandRouter: null,
        recognized: null,
        selectedProject: null,
        listening: false,
        showProjectMenu: false,
        newTodoText: ''
    },
    methods: {
        startListening: function () {
            this.listening = true;
            recognizer.start();
        },
        addTodo: function () {
            var todo = new TodoItem(
                this.newTodoText,
                false
            );
            this.selectedProject.todos.push(todo);
            this.newTodoText = '';
        },
        addTodoList: function (todoArray) {
          for (i = 0; i < todoArray.length; i++) {              
              var todo = new TodoItem(
                  todoArray[i],
                  false
              );
              this.selectedProject.todos.push(todo);
            }
            this.newTodoText = '';
        },
        selectProject: function (project) {
            this.selectedProject = project;
            this.showProjectMenu = false;
        },
        deleteTodo: function (removeTodo) {
            var project = this.selectedProject;
            project.todos = project.todos.filter(function (todo) {
                return removeTodo !== todo;
            });
        },
        deleteLastTodo: function () {
          var project = this.selectedProject;
          project.todos.pop();
        },
        hideModals: function ($event) {
            if (this.showProjectMenu) {
                if ($event.type == 'keyup' ||
                    ($event.type == 'click' && $event.target.id == 'app')) {
                    this.showProjectMenu = false;
                }
            }
        },
        toggleVoiceListening: function () {
            if (this.listening) {
                this.recognizer.stop();
                this.listening = false;
            } else {
                this.recognizer.start();
                this.listening = true;
            }
        },
        formatDate(date) {
            var monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthList[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        }
    },
    created: function () {

        var project = new Project('Default Project');
        var todo = new TodoItem('Add more todos', false);

        project.todos.push(todo);

        this.projects.push(project);
        this.selectedProject = this.projects[0];

        this.projects.push(new Project('Other Project'));

        this.commandRouter = new CommandRouter(this);
        this.recognizer = new SpeechRecognizer();
        this.recognizer.setErrorHandler(function (error) {
            alert('Error: ' + error);
        });

        this.recognizer.setResultHandler(function (results) {
            var message;
            var confidence;

            for (var i = 0; i < results.length; i++) {
                if (results[i].isFinal) {
                    message = results[i][0].transcript;
                    confidence = results[i][0].confidence;
                }
            }

            if (message) {
                this.newTodoText=message;
                this.commandRouter.route(message, confidence);
                this.recognizer.stop();
                this.listening = false;

            }
        }.bind(this));
    }
})
