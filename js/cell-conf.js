/**
 * Cell 配置项生成器
 * @ 2012/05/30 13:30:00
 */
jQuery(function($){

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
         */
        cssList : [
                    {key:'width', name:'宽度', type:this.editType, defaultType:'input', pseudo:this.pseudo, disable:''},
                    {key:'height', name:'高度', type:this.editType, defaultType:'input', pseudo:this.pseudo, disable:''},
                    {key:'color', name:'字体颜色', type:this.editType, defaultType:'color', pseudo:this.pseudo, disable:''},
                    {key:'border', name:'边框', type:this.editType, defaultType:'border', pseudo:this.pseudo, disable:''},
                    {key:'margin', name:'外边距', type:this.editType, defaultType:'ginputs', pseudo:null, disable:''},
                    {key:'text-decoration', name:'鼠标悬停样式', type:this.editType, defaultType:'select', val:{underline:'underline', none:'none'}, pseudo:this.pseudo, defaultPseudo:'hover', disable:''}
                  ],
        /**
         * cell 具有的 ABILITY 列表，格式比较固定，只需要修改该数组即可添加对应功能的支持
         */
        ability : [
                    {key:'copy'},
                    {key:'delete'},
                    {key:'container'}
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

            var htmlArray = [], cssItem;
            for(var i = 0, l = this.cssList.length; i < l; i++){
                cssItem = this.cssList[i];
                htmlArray.push('<li class="css-item">')
                htmlArray.push('<input type="checkbox" class="css-item-switch" id="css-' + cssItem.key + '">');
                htmlArray.push('<label for="css-' + cssItem.key + '" class="css-key">' + cssItem.key + '</label>编辑类型: ');
                if (!!cssItem.defaultType) {
                    htmlArray.push($(this.typeHtml).find('option[value=' + cssItem.defaultType + ']').attr('selected', 'selected').parent()[0].outerHTML);
                }else{
                    htmlArray.push(this.typeHtml); 
                };
                if(!!cssItem.defaultPseudo){
                    htmlArray.push('伪类:' + $(this.pseuHtml).find('option[value=' + cssItem.defaultPseudo + ']').attr('selected', 'selected').parent()[0].outerHTML);
                }else{
                    htmlArray.push('伪类:' + this.pseuHtml); 
                }
                htmlArray.push('<input class="css-name comm-input" type="text" value="' + cssItem.name + '">');
                htmlArray.push('<input type="checkbox" class="css-status" id="css-status-' + cssItem.key + '">');
                htmlArray.push('<label for="css-status-' + cssItem.key + '">disable</label>');
                htmlArray.push('</li>');
            }
            $('div.content ul.cell-css').append(htmlArray.join(''));

        },
        /**
         * 各配置项变化事件处理
         */
        initEvt : function(){

            $('ul.cell-css input.css-item-switch').on('change', this._initOutput);

            $('ul.cell-css input.css-status').on('change', function(){
                if($(this).parent().find('input.css-item-switch').prop('checked') === true){
                   module._initOutput(); 
                }
            });

            $('ul.cell-css input.css-name').on('blur', function(){
                if($(this).parent().find('input.css-item-switch').prop('checked') === true){
                   module._initOutput(); 
                }
            });

            $('ul.cell-css select').on('change', function(){
                if($(this).parent().find('input.css-item-switch').prop('checked') === true){
                   module._initOutput(); 
                }
            });

        },
        /**
         * 根据当前选中配置项条目生成配置项值
         */
        _initOutput : function(){
            var option = {}, cssArray = [];

            $('ul.cell-css input.css-item-switch:checked').each(function(){
                var $parent = $(this).parent(),
                    cssItem = {}, pseudo = $parent.find('select.css-pseudo').val();

                cssItem.key     = $parent.find('label.css-key').text();
                cssItem.name    = $parent.find('input.css-name').val();
                cssItem.type    = $parent.find('select.css-edit-type').val();
                cssItem.disable = $parent.find('input.css-status').prop('checked');

                if (pseudo !== '') {
                   cssItem.pseudo  = ':' + pseudo; 
                };
                cssArray.push(cssItem);
                
            });

            option.css = cssArray;
            $('div.option-output').text("data-boxoptions='" + JSON.stringify(option) + "'");
           
        }
    };

    module.init();

});