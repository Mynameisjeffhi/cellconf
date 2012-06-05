/**
 * Cell 配置项生成器
 * @ 2012/05/30 13:30:00
 */
jQuery(function($){
    // TODO: editAttr 处理；
    var module = {
        /**
         * 所有可选编辑类型
         */
        editType: ['color', 'background', 'ginputs', 'border', 'input', 'select'],
        /**
         * 所有可选伪类数组，不需要加 ':' 前缀
         */
        pseudo  : ['hover', 'active', 'link'],
        /**
         * cell 可能需要配置的样式列表，格式比较固定，只需要修改该数组即可添加对应属性的支持
         * TODO: 如果 editType 为select应当在其后增加一个输入框，里面填val，以',' 分开，并给予tooltip
         */
        cssList : [
                    {key:'width',  name:'宽度', type:this.editType, defaultType:'input', pseudo:this.pseudo, disable:''},
                    {key:'height', name:'高度', type:this.editType, defaultType:'input', pseudo:this.pseudo, disable:''},
                    {key:'color',  name:'字体颜色', type:this.editType, defaultType:'color', pseudo:this.pseudo, disable:''},
                    {key:'border', name:'边框', type:this.editType, defaultType:'border', pseudo:this.pseudo, disable:''},
                    {key:'margin', name:'外边距', type:this.editType, defaultType:'ginputs', pseudo:null, disable:''},
                    {key:'padding', name:'内边距', type:this.editType, defaultType:'ginputs', pseudo:null, disable:''},
                    {key:'background', name:'背景', type:this.editType, defaultType:'background', pseudo:this.pseudo, disable:''},
                    {key:'background-color', name:'背景颜色', type:this.editType, defaultType:'color', pseudo:this.pseudo, disable:''},
                    {key:'text-decoration', name:'鼠标悬停样式', type:this.editType, defaultType:'select', val:{underline:'underline', none:'none'}, pseudo:this.pseudo, defaultPseudo:'hover', disable:''}
                  ],
        /**
         * CELL 具有的 ABILITY 列表，格式比较固定，只需要修改该数组即可添加对应功能的支持
         */
        ability : [
                    {key:'copy',   conf:[{name: 'enable', type: 'checkbox', checked: true}, {name:'relative', type:'text', iptWidth: '184px'}]},
                    {key:'delete', conf:[{name: 'enable', type: 'checkbox', checked: true}, {name:'relative', type:'text', iptWidth: '184px'}]},
                    {key:'container', conf:[{name: 'number', type: 'text', iptWidth: '24px', val: 'n'}, {name:'enableType', type:'text', iptWidth: '90px', val: 'cell'}]},
                    {key:'editAttr'}
                  ],
        /**
         * 所有可选编辑类型html，原则上应该根据editType数组动态生成，不过这样比较麻烦，所以干脆固定
         */
        typeHtml: '<select class="css-edit-type">\
                        <option value="color">color</option>\
                        <option value="background">background</option>\
                        <option value="ginputs">ginputs</option>\
                        <option value="border">border</option>\
                        <option value="input">input</option>\
                        <option value="select">select</option>\
                   </select>',
        /**
         * 所有伪类html，原则上应该根据pseudo数组动态生成，不过这样比较麻烦，所以干脆固定
         */
        pseuHtml: '<select class="css-pseudo">\
                        <option value="">choose..</option>\
                        <option value="hover">hover</option>\
                        <option value="link">link</option>\
                        <option value="active">active</option>\
                   </select>',
        $output     : $('div.option-output'),
        $cellCss    : $('div.content ul.cell-css'),
        $cellAbility: $('div.content ul.cell-ability'),
        /**
         * 初始化入口
         */
        init    : function(){

            this.initUI();
            this.initEvt();
            this._initOutput();

        },
        /**
         * 初始化配置项列表
         */
        initUI  : function(){

            var htmlArray = [], confItem;
            for(var i = 0, l = this.cssList.length; i < l; i++){

                confItem = this.cssList[i];
                htmlArray.push('<li class="item">');
                htmlArray.push('<input type="checkbox" class="item-switch" id="item-' + confItem.key + '">');
                htmlArray.push('<label for="item-' + confItem.key + '" class="item-key">' + confItem.key + '</label>编辑类型: ');
                // 如果配置了默认的编辑类型则将此编辑类型设为选中状态
                if ( !!confItem.defaultType ) {
                    htmlArray.push($(this.typeHtml).find('option[value=' + confItem.defaultType + ']').attr('selected', 'selected').parent()[0].outerHTML);
                }else{
                    htmlArray.push(this.typeHtml); 
                };
                // 如果配置了默认的伪类则将此伪类设为选中状态
                if(!!confItem.defaultPseudo){
                    htmlArray.push('伪类:' + $(this.pseuHtml).find('option[value=' + confItem.defaultPseudo + ']').attr('selected', 'selected').parent()[0].outerHTML);
                }else{
                    htmlArray.push('伪类:' + this.pseuHtml); 
                }
                htmlArray.push('<input class="item-name comm-input" type="text" value="' + confItem.name + '">');
                htmlArray.push('<input type="checkbox" class="item-status" id="item-status-' + confItem.key + '">');
                htmlArray.push('<label for="item-status-' + confItem.key + '">disable</label></li>');

            }
            this.$cellCss.append(htmlArray.join(''));

            htmlArray = [];
            for(var i = 0, l = this.ability.length; i < l; i++){
                confItem = this.ability[i];
                htmlArray.push('<li class="item">')
                htmlArray.push('<input type="checkbox" class="item-switch" id="item-' + confItem.key + '">');
                htmlArray.push('<label for="item-' + confItem.key + '" class="item-key">' + confItem.key + '</label>');

                if(!!confItem.conf && confItem.conf.length > 0){
                    var abItem, idName;
                    for(var m = 0,  n = confItem.conf.length; m < n; m++){

                        abItem = confItem.conf[m];

                        if( abItem.type === 'checkbox' ){

                          idName = 'item-ck-' + confItem.key + '-' + abItem.name;

                          if(abItem.checked){
                            htmlArray.push('<input type="checkbox" class="item-ck" checked id="' + idName + '">');
                          }else{
                            htmlArray.push('<input type="checkbox" class="item-ck" id="' + idName + '">');
                          }

                          htmlArray.push('<label for="' + idName + '">' + abItem.name + '</label>');

                        }else if( abItem.type === 'text' ){

                          idName = 'item-ipt-' + confItem.key + '-' + abItem.name;
                          htmlArray.push('<span class="item-text-title">' + abItem.name + '</span>:');
                          htmlArray.push('<input class="item-text-ipt comm-input" type="text" id="' + idName + '" style="width:' + abItem.iptWidth + '" value="' + (!!abItem.val?abItem.val:"") + '">');

                        }
                    }
                }
                
                htmlArray.push('</li>');
            }
            this.$cellAbility.append(htmlArray.join(''));

        },
        /**
         * 各配置项变化事件处理
         */
        initEvt : function(){

            $('input.item-switch', this.$cellCss).on('change', function(){
                module._initOutput();

                if($(this).prop('checked') === true){
                   module._highLight( $(this).parent(), "{");
                }
            });

            $('input.item-switch', this.$cellAbility).on('change', function(){
                module._initOutput();

                if($(this).prop('checked') === true){
                   module._highLight( $(this).parent(), '"' );
                }
            });

            $('input.item-status', this.$cellCss).on('change', function(){
                if($(this).parent().find('input.item-switch').prop('checked') === true){
                   module._initOutput(); 
                   module._highLight( $(this).parent(), "{");
                }
            });

            $('input.item-name', this.$cellCss).on('blur', function(){
                if($(this).parent().find('input.item-switch').prop('checked') === true){
                   module._initOutput(); 
                   module._highLight( $(this).parent(), "{");
                }
            });

            $('select', this.$cellCss).on('change', function(){
                if($(this).parent().find('input.item-switch').prop('checked') === true){
                   module._initOutput(); 
                   module._highLight( $(this).parent(), "{");
                }
            });

            $('input.item-ck', this.$cellAbility).on('change', function(){
                if($(this).parent().find('input.item-switch').prop('checked') === true){
                   module._initOutput(); 
                   module._highLight( $(this).parent(), '"' );
                }
            });

            $('input.item-text-ipt', this.$cellAbility).on('blur', function(){
                if($(this).parent().find('input.item-switch').prop('checked') === true){
                   module._initOutput(); 
                   module._highLight( $(this).parent(), '"' );
                }
            });

            $('li.item', this.$cellCss).on('hover', function(){

                module._highLight(this, "{");
            });

            $('li.item', this.$cellAbility).on('hover', function(){

                module._highLight(this, '"');

            });

            // 鼠标移入output区清除高亮显示
            this.$output.on('hover', function(){

                module.$output.text(module.$output.data('option'));
            });

        },
        /**
         * 根据当前选中配置项条目生成配置项值
         */
        _initOutput : function(){

            var option = {}, cssArray = [];

            $('input.item-switch:checked', module.$cellCss).each(function(){
                var $parent = $(this).parent(),
                    cssItem = {}, pseudo = $parent.find('select.css-pseudo').val();

                cssItem.key     = $parent.find('label.item-key').text();
                cssItem.name    = $parent.find('input.item-name').val();
                cssItem.type    = $parent.find('select.css-edit-type').val();
                cssItem.disable = $parent.find('input.item-status').prop('checked').toString();

                if (pseudo !== '') {
                   cssItem.pseudo  = ':' + pseudo; 
                };
                cssArray.push(cssItem);
                
            });

            option.css = cssArray;

            var ability = {} , iptVal;
            if ( $('#item-copy').prop('checked') === true ) {
                ability.copy = {};
                iptVal = $('#item-ipt-copy-relative').val();
                ability.copy.enable = $('#item-ck-copy-enable').prop('checked').toString();

                if($.trim(iptVal) !== '') ability.copy.relative = iptVal.split(',');
                
            };
            if ( $('#item-delete').prop('checked') === true ) {
                ability.delete = {};
                iptVal = $('#item-ipt-delete-relative').val();
                ability.delete.enable = $('#item-ck-delete-enable').prop('checked').toString();

                if($.trim(iptVal) !== '') ability.delete.relative = iptVal.split(',');

            };
            if ( $('#item-container').prop('checked') === true ) {
                ability.container = {};
                iptVal = $('#item-ipt-container-enableType').val();
                ability.container.number = $('#item-ipt-container-number').val();

                if($.trim(iptVal) !== '') ability.container.enableType = iptVal;
            };
            if ( $('#item-editAttr').prop('checked') === true ) {
                ability.editAttr = {};
            };
            option.ability = ability;
            // JSON Object is Unavailable In IE Browser.
            // $('div.option-output').text("data-boxoptions='" + JSON.stringify(option) + "'");

            $.use('util-json', function(){
                // JSON.stringify();
                var result = "data-boxoptions='" + JSON.stringify(option) + "'";
                module.$output.html(result);
                module.$output.data('option', result);
            });
            
        },
        /**
         * 鼠标Hover时高亮相应的配置项，方便人工校验
         */
        _highLight  : function(self, startStr){

            if($(self).find('input.item-switch').prop('checked')){
                var key     = $(self).find('label.item-key').text(),
                    text    = module.$output.data('option');

                // 由于 css 和 editType 里面都有 background 所以这种情况要多考虑些加上"key":"前缀
                if(startStr === '{'){
                    var keyIdx  = text.indexOf('"key":"' + key);
                }else{
                    var keyIdx  = text.indexOf(key); 
                }
                
                var sub1    = text.substring(0, keyIdx),
                    sub2    = text.substring(keyIdx),
                    start   = sub1.lastIndexOf(startStr),
                    end     = sub2.indexOf('}') + sub1.length,
                    output  = text.substring(0, start) + '<em>' + text.substring(start, end + 1) + '</em>' + text.substring(end + 1);

                module.$output.html(output);
            }
            return false;

        }
    };

    module.init();

});

