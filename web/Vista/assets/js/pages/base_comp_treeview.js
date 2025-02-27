/*
 *  Document   : base_comp_treeview.js
 *  Author     : pixelcave
 *  Description: Custom JS code used in Tree View Page
 */

var BaseCompTreeview = function() {
    // Bootstrap Tree View, for more examples you can check out https://github.com/jonmiles/bootstrap-treeview

    // Init Tree Views
    var initTreeViews = function(){
        // Set default example tree data for all Tree Views
        var $treeData = [
            {
                text: 'Semestral Médica',
                href: '#parent1',
                tags: ['3'],
                nodes: [
                    {
                        text: 'Médicina General',
                        href: '#child1',
                        tags: ['1'],
                        nodes: [
                            {
                                text: 'Medicina Estética',
                                href: '#grandchild1',
                                tags: ['2'],
                                nodes: [
                            {
                                text: 'Ciencias de la comunicación',
                                href: '#grandchild1'
                            },
                            {
                                text: 'Matemáticas aplicadas',
                                href: '#grandchild2',
                          
                            }
                        ]
                            }
                        ]
                    }
                ]
            }
            
        ];

        // Init Simple Tree
        jQuery('.js-tree-simple').treeview({
            data: $treeData,
            color: '#555',
            expandIcon: 'fa fa-plus',
            collapseIcon: 'fa fa-minus',
            onhoverColor: '#f9f9f9',
            selectedColor: '#555',
            selectedBackColor: '#f1f1f1',
            showBorder: false,
            levels: 3
        });

        // Init Icons Tree
        jQuery('.js-tree-icons').treeview({
            data: $treeData,
            color: '#555',
            expandIcon: 'fa fa-plus',
            collapseIcon: 'fa fa-minus',
            nodeIcon: 'fa fa-folder text-primary',
            onhoverColor: '#f9f9f9',
            selectedColor: '#555',
            selectedBackColor: '#f1f1f1',
            showBorder: false,
            levels: 3
        });

        // Init Alternative Icons Tree
        jQuery('.js-tree-icons-alt').treeview({
            data: $treeData,
            color: '#555',
            expandIcon: 'fa fa-angle-down',
            collapseIcon: 'fa fa-angle-up',
            nodeIcon: 'fa fa-file-o text-city',
            onhoverColor: '#f9f9f9',
            selectedColor: '#555',
            selectedBackColor: '#f1f1f1',
            showBorder: false,
            levels: 3
        });

        // Init Badges Tree
        jQuery('.js-tree-badges').treeview({
            data: $treeData,
            color: '#555',
            expandIcon: 'fa fa-plus',
            collapseIcon: 'fa fa-minus',
            nodeIcon: 'fa fa-folder text-primary',
            onhoverColor: '#f9f9f9',
            selectedColor: '#555',
            selectedBackColor: '#f1f1f1',
            showTags: true,
            levels: 3
        });

        // Init Collapsed Tree
        jQuery('.js-tree-collapsed').treeview({
            data: $treeData,
            color: '#555',
            expandIcon: 'fa fa-plus',
            collapseIcon: 'fa fa-minus',
            nodeIcon: 'fa fa-cube text-primary-light',
            onhoverColor: '#f9f9f9',
            selectedColor: '#555',
            selectedBackColor: '#f1f1f1',
            showTags: true,
            levels: 1
        });

        // Set example JSON data for JSON Tree View
        var $treeDataJson = '[' +
          '{' +
            '"text": "Bootstrap",' +
            '"nodes": [' +
              '{' +
                '"text": "eLearning",' +
                '"nodes": [' +
                  '{' +
                    '"text": "Code"' +
                  '},' +
                  '{' +
                    '"text": "Tutorials"' +
                  '}' +
                ']' +
              '},' +
              '{' +
                '"text": "Templates"' +
              '},' +
              '{' +
                '"text": "CSS",' +
                '"nodes": [' +
                  '{' +
                    '"text": "Less"' +
                  '},' +
                  '{' +
                    '"text": "SaSS"' +
                  '}' +
                ']' +
              '}' +
            ']' +
          '},' +
          '{' +
            '"text": "Design"' +
          '},' +
          '{' +
            '"text": "Coding"' +
          '},' +
          '{' +
            '"text": "Marketing"' +
          '}' +
        ']';

        // Init Json Tree
        jQuery('.js-tree-json').treeview({
            data: $treeDataJson,
            color: '#555',
            expandIcon: 'fa fa-arrow-down',
            collapseIcon: 'fa fa-arrow-up',
            nodeIcon: 'fa fa-file-code-o text-flat',
            onhoverColor: '#f9f9f9',
            selectedColor: '#555',
            selectedBackColor: '#f1f1f1',
            showTags: true,
            levels: 3
        });
    };

    return {
        init: function () {
            // Init all Tree Views
            initTreeViews();
        }
    };
}();

// Initialize when page loads
jQuery(function(){ BaseCompTreeview.init(); });