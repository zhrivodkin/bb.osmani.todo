// маршрутизатор задач
// ----------
var Workspace = Backbone.Router.extend({
    routes: {
        '*filter': 'setFilter'
    },
    setFilter: function(param) {
        // задание текущего фильтра
        if (param) {
            param = param.trim();
        }
        app.TodoFilter = param || '';
        // генерация события filter коллекции, вызывающего
        // скрытие/отображение задач
        window.app.Todos.trigger('filter');
    }
});
app.TodoRouter = new Workspace();
Backbone.history.start();