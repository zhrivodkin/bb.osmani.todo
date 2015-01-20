var app = app || {};
// Представление задачи
// --------------
// DOM-элемент задачи представляет собой...
app.TodoView = Backbone.View.extend({
    //... тег списка.
    tagName: 'li',
    // Кэширование функции шаблона для отдельного элемента.
    template: _.template($('#item-template').html()),
    // DOM-события, специфичные для элемента.
    events: {
        'click .toggle': 'togglecompleted', // Новый код
        'dblclick label': 'edit',
        'click .destroy': 'clear', // Новый код
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close'
    },
    // представление TodoView прослушивает изменения своей модели
    // и выполняет ее повторное отображение. Поскольку в этом приложении
    // **Todo** и **TodoView** соотносятся 1 к 1,
    // для удобства мы устанавливаем прямую ссылку на модель.
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove); 
        this.listenTo(this.model, 'visible', this.toggleVisible); 
    },
    // Повторное отображение заголовков задачи.
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$el.toggleClass('completed', this.model.get('completed'));
        this.toggleVisible(); 
        this.$input = this.$('.edit');
        return this;
    },
    // переключает видимость элемента
    toggleVisible: function() {
        console.log('toggle', this.isHidden());
        this.$el.toggleClass('hidden', this.isHidden());
    },
    // определяет, должен ли элемент быть скрытым
    isHidden: function() {
        var isCompleted = this.model.get('completed');
        console.log('isCompleted', isCompleted, 'app.TodoFilter', app.TodoFilter);
        return ( // только для скрытых
            (!isCompleted && app.TodoFilter === 'completed') || (isCompleted && app.TodoFilter === 'active')
        );
    },
    // НОВОЕ: переключает состояние completed модели.
    togglecompleted: function() {
        this.model.toggle();
    },
    // Переключение этого представления в режим редактирования
    // и отображение поля ввода.
    edit: function() {
        this.$el.addClass('editing');
        this.$input.focus();
    },
    // Закрытие режима редактирования, сохранение изменений в задаче.
    close: function() {
        var value = this.$input.val().trim();
        if (value) {
            this.model.save({
                title: value
            });
        } else {
            this.clear(); // НОВОЕ
        }
        this.$el.removeClass('editing');
    },
    // Если вы нажмете `enter`, редактирование элемента завершится.
    updateOnEnter: function(e) {
        if (e.which === ENTER_KEY) {
            this.close();
        }
    },
    // НОВОЕ – удаление элемента, уничтожение модели
    // в локальном хранилище и удаление ее представления
    clear: function() {
        this.model.destroy();
    }
});