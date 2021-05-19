/* Javascript for MyXBlock. */
function CmsBlock(runtime, element) {

    var handlerUrl = runtime.handlerUrl(element, 'select_cms_block');
    var handlerSubSectionUrl = runtime.handlerUrl(element, 'select_cms_block_subsections');
    var cmsHost = ''

    $('#courseFilter').on('change', function(){
        var filter = this.value

        $("#entry option").each(function(){

            var courseTag =  $(this).attr('attr-course')

            if( filter == '' ){
                $(this).removeAttr('hidden')
            }
            else if( typeof courseTag == 'undefiend' && filter != '' ){
                // options without course defined
                $(this).attr('hidden', 'hidden')
            }
            else {
                if( courseTag == filter )
                    $(this).removeAttr('hidden')
                else
                    $(this).attr('hidden','hidden')
            }
        });
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
    });
}
