/* Javascript for MyXBlock. */
function CmsBlock(runtime, element) {

    var handlerUrl = runtime.handlerUrl(element, 'select_cms_block');
    var handlerSubSectionUrl = runtime.handlerUrl(element, 'select_cms_block_subsections');
    var handlerTableUrl = runtime.handlerUrl(element, 'get_table_data');
    var cmsHost = ''

    $('#courseFilter').on('change', function() {
        var filter = this.value
        update_entry_options(filter)
    });

    $('#entry').on('change', function() {
        var parts = this.value.split('::')
        var type = parts[0]
        var slug = parts[1]
        var request = {}
        request[type] = slug

        $.ajax({
            type: "POST",
            url: handlerUrl,
            data: JSON.stringify(request),
            success: function(result){
                cmsHost = result.cmsHost;
                render_entry(type, result.entry)
            }
        });
    });

    $('#tableEntry').on('change', function(){
        var filter = this.value
        console.log(filter)
        data = {
            'table':filter
        }

        $.ajax({
            type:"POST",
            url: handlerTableUrl,
            data: JSON.stringify(data),
            success: function(result){
                console.log(result)
                tableFromJson(result.table)
            }
        })
    })

    update_entry_options = function(filter){
        const types = ['clauses', 'courses', 'lessons', 'pages']
        const singularTypes = ['clause', 'course', 'lesson', 'page']

        for(index in types){
            var typeKey = types[index]
            var singularType = singularTypes[index]
            
            $('#' + typeKey + 'Options').empty()

            window[typeKey].forEach( function(elem){
                if( filter == '' || (elem.coursetag.length > 0 && elem.coursetag[0].slug == filter) )
                {
                    var option = document.createElement('option');
                    option.appendChild( document.createTextNode(elem.title) );        
                    option.value = singularType + '::' + elem.slug; 

                    if( window.entrySlug != '' && window.entrySlug == elem.slug && window.entryType != '' && window.entryType == singularType)
                        option.selected = 'selected'

                    $('#' + typeKey + 'Options').append(option); 
                }
            })
        }
    }

    render_entry = function(type, entry) {
        switch(type){
            case 'clause':
                $('#generalView').first().html(
                    '<form id="clause" onChange="updateSelection(this)" onsubmit="javascript:void(0);" entry-type="clause">' + 
                        renderField('clauseText', entry) + 
                        renderField('lmsText', entry) + 
                        renderField('lmsAdvancedConcepts', entry) + 
                        renderField('platformText', entry) + 
                        renderField('platformAdvancedConcepts', entry) + 
                        renderField('cmsAsset', entry) + 
                        renderField('faq', entry) + 
                        renderField('tip', entry) + 
                    '</form>'
                )
                break;

            case 'course':
                $('#generalView').first().html(
                    '<form id="course" onChange="updateSelection(this)" onsubmit="javascript:void(0);" entry-type="course">' + 
                        renderField('contentBlock', entry) + 
                        renderField('cmsAsset', entry) + 
                        renderField('faq', entry) + 
                        renderField('tip', entry) + 
                    '</form>'
                )
                break;
                            
            case 'lesson':
                $('#generalView').first().html(
                    '<form id="lesson" onChange="updateSelection(this)" onsubmit="javascript:void(0);" entry-type="lesson">' + 
                        renderField('contentBlock', entry) + 
                        renderField('cmsAsset', entry) + 
                        renderField('faq', entry) + 
                        renderField('tip', entry) + 
                    '</form>'
                )
                break;
                
            case 'page':
                $('#generalView').first().html(
                    '<form id="page" onChange="updateSelection(this)" onsubmit="javascript:void(0);" entry-type="page">' + 
                        renderField('contentBlock', entry) + 
                        renderField('cmsAsset', entry) + 
                        renderField('faq', entry) + 
                        renderField('tip', entry) + 
                    '</form>'
                )
                break;
        }
        
    }


    renderField = function(type, entry){
        if( typeof entry[type] == 'undefined' || entry[type] == ''  || entry[type] == null )
            return '';

        let base = '<div style="padding: 0.8em; margin: 0.5em; background: lightgray; border-radius: 7px;">';
        switch(type){
            case 'clauseText': 
                base += '<label><input type="checkbox" name="' + type + '" checked="checked"/> Include Clause Text</label>';
                base += entry.clauseText;
                break;

            case 'lmsText':
                base += '<label><input type="checkbox" name="' + type + '" checked="checked"/> Include LMS Text</label>';
                base += entry.lmsText;
                break;

            case 'lmsAdvancedConcepts':
                base += '<label><input type="checkbox" name="' + type + '" checked="checked"/> Include LMS Advanced Concepts</label>';
                base += entry.lmsAdvancedConcepts
                break;

            case 'platformText':
                base += '<label><input type="checkbox" name="' + type + '" checked="checked"/> Include Platform Text</label>';
                base += entry.platformText;
                break;

            case 'platformAdvancedConcepts':
                base += '<label><input type="checkbox" name="' + type + '" checked="checked"/> Include Platform Advanced Concepts</label>';
                base += entry.platformAdvancedConcepts;
                break;

            case 'contentBlock':
                entry.contentBlock.forEach( function(elem) {
                    base += '<label><input type="checkbox" name="' + type + '[' + elem.id + ']" checked="checked"/> Include Content Block</label>';
                    base += '<div>' + 
                        '<h5>' + elem.blockTitle +'</h5>' + 
                            '<div>' + elem.blockContent + '</div>' + 
                        '</div>';
                })
                break;

            case 'cmsAsset':
                entry.cmsAsset.forEach( function(elem){
                    if( typeof elem.assetfile[0] != 'undefined' ){
                        base += '<label><input type="checkbox" name="' + type + '[' + elem.id + ']" checked="checked"/> Include Asset</label>';
                        base += '<div>' + 
                            '<h5>' + elem.assetTitle +'</h5>' + 
                                '<div>' + ( typeof elem.assetType != 'undefined' && elem.assetType == 'image' ? 
                                    '<img src="' + cmsHost + elem.assetfile[0].url + '" class="img-fluid" />' : elem.assetfile[0].url ) + 
                                '</div>' + 
                            '</div>';
                    }
                })
                break;

            case 'faq':
                entry.faq.forEach( function(elem){
                    base += '<label><input type="checkbox" name="' + type + '[' + elem.id + ']" checked="checked"/> Include FAQ</label>';
                    base += 
                        '<div>' + 
                            '<h5>' + elem.question + '</h5>' + 
                            '<div>' + elem.answer + '</div>' + 
                        '</div>';
                    
                })
                break;

            case 'tip':
                entry.tip.forEach( function(elem){
                    base += '<label><input type="checkbox" name="' + type + '[' + elem.id + ']" checked="checked"/> Include Tip</label>';
                    base += 
                        '<div>' + 
                            '<h5>' + elem.tipTitle + '</h5>' + 
                            '<div>' + elem.tipContent + '</div>' + 
                        '</div>';
                    
                })
                break;
        }
        base += '</div>';
        return base;
    };

    updateSelection = function(form){
        var selection = $(form).serializeArray()
        data = {
            'type': $(form).attr('entry-type'),
            'selected': selection
        }

        $.ajax({
            type: "POST",
            url: handlerSubSectionUrl,
            data: JSON.stringify(data),
            success: function(result){
                console.log(result)
            }
        });
    }

    $(function ($) {
        /* Here's where you'd do things on page load. */
        update_entry_options($('#courseFilter').val())
    });


    function tableFromJson(jsonData) {
        // the json data. (you can change the values for output.)
        $('#showData').empty()
        var myBooks = jsonData

        // Extract value from table header. 
        // ('Book ID', 'Book Name', 'Category' and 'Price')
        var col = [];
        for (var i = 0; i < myBooks.length; i++) {
            for (var key in myBooks[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // Create a table.
        var table = document.createElement("table");

        // Create table header row using the extracted headers above.
        var tr = table.insertRow(-1);                   // table row.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // table header.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // add json data to the table as rows.
        for (var i = 0; i < myBooks.length; i++) {

            tr = table.insertRow(-1);

            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = myBooks[i][col[j]];
            }
        }

        // Now, add the newly created table with json data, to a container.
        var divShowData = document.getElementById('showData');
        divShowData.innerHTML = "";
        divShowData.appendChild(table);
    }

}
