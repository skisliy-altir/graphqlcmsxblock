/* Javascript for MyXBlock. */
function CmsBlock(runtime, element) {

    var handlerUrl = runtime.handlerUrl(element, 'select_cms_block');
    var handlerSubSectionUrl = runtime.handlerUrl(element, 'select_cms_block_subsections');
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
        console.log(request)

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
                        renderField('table2colMatrix', entry) +
                        renderField('table3colMatrix', entry) +
                        renderField('table4colMatrix', entry) +
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
                        renderField('table2colMatrix', entry) +
                        renderField('table3colMatrix', entry) +
                        renderField('table4colMatrix', entry) +
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
                        renderField('table2colMatrix', entry) +
                        renderField('table3colMatrix', entry) +
                        renderField('table4colMatrix', entry) +
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
                        renderField('table2colMatrix', entry) +
                        renderField('table3colMatrix', entry) +
                        renderField('table4colMatrix', entry) +
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
                
            case 'table2colMatrix':
                entry.table2colMatrix.forEach( function(elem){
                    base += '<label><input type="checkbox" name="' + type +'"  checked="checked"/> Include Table</label>';
                    base += '<table>' 

                    tableData = elem.table2col

                    if(elem.hasheaderrow == "yes"){
                        base += '<tr>'+
                            '<th>' + tableData[0].col1 + '</th>' +
                            '<th>' + tableData[0].col2 + '</th>'  +
                            '</tr>'
                        tableData = elem.table2col.slice(1)
                    }

                    tableData.forEach(function(rows){

                        base+= '<tr>'
                        + '<td>' + rows.col1 + '</td>' +
                        '<td>' + rows.col2 + '</td>' +              
                        '</tr>'
                    })
                    
                    base += '</table>'
                })
                break;

            case 'table3colMatrix':
                entry.table3colMatrix.forEach( function(elem){
                    base += '<label><input type="checkbox" name="' + type +'"  checked="checked"/> Include Table</label>';
                    base += '<table>' 

                    tableData = elem.table3col

                    if(elem.hasheaderrow == "yes"){
                        base += '<tr>'+
                            '<th>' + tableData[0].col1 + '</th>' +
                            '<th>' + tableData[0].col2 + '</th>'  +
                            '<th>' + tableData[0].col3 +'</th>' +
                            '</tr>'
                        tableData = elem.table3col.slice(1)
                    }

                    tableData.forEach(function(rows){

                        base+= '<tr>'
                        + '<td>' + rows.col1 + '</td>' +
                        '<td>' + rows.col2 + '</td>' + 
                        '<td>' + rows.col3 + '</td>'             
                        '</tr>'
                    })
                    
                    base += '</table>'
                })
                break;

            case 'table4colMatrix':
                entry.table4colMatrix.forEach( function(elem){
                    base += '<label><input type="checkbox" name="' + type +'"  checked="checked"/> Include Table</label>';
                    base += '<table>' 

                    tableData = elem.table4col

                    if(elem.hasheaderrow == "yes"){
                        base += '<tr>'+
                            '<th>' + tableData[0].col1 + '</th>' +
                            '<th>' + tableData[0].col2 + '</th>'  +
                            '<th>' + tableData[0].col3 +'</th>' +
                            '<th>' + tableData[0].col4 +'</th>' +
                            '</tr>'
                        tableData = elem.table4col.slice(1)
                    }

                    tableData.forEach(function(rows){

                        base+= '<tr>'
                        + '<td>' + rows.col1 + '</td>' +
                        '<td>' + rows.col2 + '</td>' + 
                        '<td>' + rows.col3 + '</td>' +
                        '<td>' + rows.col4 + '</td>' +           
                        '</tr>'
                    })
                    
                    base += '</table>'
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

}
