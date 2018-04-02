const model_alert = require('./modules/modal_alert/modal_alert');


var proxy = {
    getRuleHtml() {
        return Handlebars.compile($("#create_proxy_rule_template").html())({});
    },
    add() {
        $('#proxy_rules').append(this.getRuleHtml());
    },
    bind() {
        var _self = this;
        $('#add_proxy_rule').click(function () {
            _self.add()
        })
        $('#proxy_rules').on('click', '.rule_moveup', function () {
            var thisrule = $(this).parents('.proxy_rules_item');
            var thisindex = thisrule.index();
            if (thisindex != 0) {
                $('.proxy_rules_item').eq(thisindex - 1).before(thisrule);
            }
        });

        $('#proxy_rules').on('click', '.rule_movedown', function () {
            var thisrule = $(this).parents('.proxy_rules_item');
            var thisindex = thisrule.index();
            if (thisindex != ($('.proxy_rules_item').length - 1)) {
                $('.proxy_rules_item').eq(thisindex + 1).after(thisrule);
            }
        });

        $('#proxy_rules').on('click', '.delete_rule', function () {
            if ($('.proxy_rules_item').length > 1) {
                $(this).parents('.proxy_rules_item').remove();
            } else {
                modal_alert({
                    content: '最后一条规则不能删除！'
                });
            }

        });

        $('#save_proxy').click(function () {
            let portnum = $('#portnum').val();
            var rules = [];

            $('.proxy_rules_item').each(function (i, v) {
                rules.push({
                    route: $('.porxy_route', $(v)).val(),
                    url: $('.porxy_url', $(v)).val()
                });
            });
            
            console.log(portnum)

            $.ajax({
                url: '/proxy/save',
                type: 'POST',
                dataType: 'json',
                data: {
                  rules: JSON.stringify(rules),
                  portnum: portnum
                }
              })
              .done(function (json) {
                if (json.re) {
                  $('#save_proxy_tips').show();
                  setTimeout(function () {
                    $('#save_proxy_tips').hide();
                  }, 3000);
                }
              })
              .fail(function (error) {
                model_alert(error.message)
              })
              
            return false;
        })
    },
    init() {
        this.add();
        this.bind();
    }
}

proxy.init();