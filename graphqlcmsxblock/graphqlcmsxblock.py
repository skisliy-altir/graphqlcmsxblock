"""
Graph QL XBlock to pull CMS content
"""
import pkg_resources
from web_fragments.fragment import Fragment
from xblock.core import XBlock
from xblock.fields import Integer, String, List, Scope
from django.template import Context, Template
import requests
import re
from xblockutils.resources import ResourceLoader

class GraphQlCmsXBlock(XBlock):

    loader = ResourceLoader(__name__)

    clauseGraphQlQuery = """ {
                uid,
                slug,
                title,
                postDate,
                ... on clauses_clause_Entry {
                    courseName,
                    agreementType {
                        title
                    },
                    clauseText,
                    contentBlock {
                        ... on contentBlock_contentBlock_BlockType {
                            id,
                            blockTitle,
                            blockContent,
                            contentUsedFor,
                            cssClass,
                            componentIcon {
                                url
                            }
                        }
                    },
                    cmsAsset {
                        ... on cmsAsset_cmsAsset_BlockType {
                            id,
                            assetTitle,
                            assetType,
                            assetUsedFor,
                            assetfile  {
                                url
                            }
                        }
                    },
                    faq{
                        ... on faq_faq_BlockType {
                            id,
                            question,
                            answer
                        }
                    },
                    tip{
                        ... on tip_tip_BlockType {
                            id,
                            tipTitle,
                            tipContent,
                            tipType{
                                title
                            },
                            tipIcon{
                                url
                            },
                            tipCssClass
                        }
                    },
                    table2colMatrix{
                        ... on table2colMatrix_matrix2col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table2col{
                                ... on table2col_BlockType{
                                    col1, 
                                    col2
                                }
                            }                        
                        }
                    },
                    table3colMatrix{
                        ... on table3colMatrix_matrix3col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table3col{
                                ... on table3col_BlockType{
                                    col1, 
                                    col2, 
                                    col3
                                }
                            }
                        }
                    },
                    table4colMatrix{
                        ... on table4colMatrix_matrix4col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table4col{
                                ... on table4col_BlockType{
                                    col1, 
                                    col2, 
                                    col3, 
                                    col4
                                }
                            }
                        }
                    },
                    table5colMatrix{
                        ... on table5colMatrix_matrix5col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table5col{
                                ... on table5col_BlockType{
                                    col1, 
                                    col2, 
                                    col3, 
                                    col4,
                                    col5
                                }
                            }
                        }
                    },
                    accordionneo{
                        ... on accordionneo_accordion_BlockType{
                            id,
                            accordionTitle,
                            accordionClasses,
                            accordionmatrix{
                                ... on accordionmatrix_accordionblock_BlockType{
                                    accordionblocktitle,
                                    accordionblockcontent
                                }
                            }
                        }
			        }  
                } 
            } """

    courseGraphQlQuery = """ {
                uid,
                slug,
                title,
                postDate,
                ... on courses_courses_Entry {
                    courseName,
                    agreementType {
                        title
                    },
                    contentBlock {
                        ... on contentBlock_contentBlock_BlockType {
                            id,
                            blockTitle,
                            blockContent,
                            contentUsedFor,
                            cssClass,
                            componentIcon {
                                url
                            }
                        }
                    },
                    cmsAsset {
                        ... on cmsAsset_cmsAsset_BlockType {
                            id,
                            assetTitle,
                            assetType,
                            assetUsedFor,
                            assetfile  {
                                url
                            }
                        }
                    },
                    faq{
                        ... on faq_faq_BlockType {
                            id,
                            question,
                            answer
                        }
                    },
                    tip{
                        ... on tip_tip_BlockType {
                            id,
                            tipTitle,
                            tipContent,
                            tipType{
                                title
                            },
                            tipIcon{
                                url
                            },
                            tipCssClass
                        }
                    },
                    table2colMatrix{
                        ... on table2colMatrix_matrix2col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table2col{
                                ... on table2col_BlockType{
                                    col1, 
                                    col2
                                }
                            }                        
                        }
                    },
                    table3colMatrix{
                        ... on table3colMatrix_matrix3col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table3col{
                                ... on table3col_BlockType{
                                    col1, 
                                    col2, 
                                    col3
                                }
                            }
                        }
                    },
                    table4colMatrix{
                        ... on table4colMatrix_matrix4col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table4col{
                                ... on table4col_BlockType{
                                    col1, 
                                    col2, 
                                    col3, 
                                    col4
                                }
                            }
                        }
                    },
                     table5colMatrix{
                        ... on table5colMatrix_matrix5col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table5col{
                                ... on table5col_BlockType{
                                    col1, 
                                    col2, 
                                    col3, 
                                    col4,
                                    col5
                                }
                            }
                        }
                    },
                    accordionneo{
                        ... on accordionneo_accordion_BlockType{
                            id,
                            accordionTitle,
                            accordionClasses,
                            accordionmatrix{
                                ... on accordionmatrix_accordionblock_BlockType{
                                    accordionblocktitle,
                                    accordionblockcontent
                                }
                            }
                        }
			        }                                          
                } 
            } """

    sectionsGraphQlQuery = """{
                uid,
                slug,
                title,
                postDate,
                ... on sections_sections_Entry {
                    courseName,
                    agreementType {
                        title
                    },
                    contentBlock {
                        ... on contentBlock_contentBlock_BlockType {
                            id,
                            blockTitle,
                            blockContent,
                            contentUsedFor,
                            cssClass,
                            componentIcon {
                                url
                            }
                        }
                    },
                    cmsAsset {
                        ... on cmsAsset_cmsAsset_BlockType {
                            id,
                            assetTitle,
                            assetType,
                            assetUsedFor,
                            assetfile  {
                                url
                            }
                        }
                    },
                    faq{
                        ... on faq_faq_BlockType {
                            id,
                            question,
                            answer
                        }
                    },
                    tip{
                        ... on tip_tip_BlockType {
                            id,
                            tipTitle,
                            tipContent,
                            tipType{
                                title
                            },
                            tipIcon{
                                url
                            },
                            tipCssClass
                        }
                    },
                    table2colMatrix{
                        ... on table2colMatrix_matrix2col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table2col{
                                ... on table2col_BlockType{
                                    col1, 
                                    col2
                                }
                            }                        
                        }
                    },
                    table3colMatrix{
                        ... on table3colMatrix_matrix3col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table3col{
                                ... on table3col_BlockType{
                                    col1, 
                                    col2, 
                                    col3
                                }
                            }
                        }
                    },
                    table4colMatrix{
                        ... on table4colMatrix_matrix4col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table4col{
                                ... on table4col_BlockType{
                                    col1, 
                                    col2, 
                                    col3, 
                                    col4
                                }
                            }
                        }
                    },
                    table5colMatrix{
                        ... on table5colMatrix_matrix5col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table5col{
                                ... on table5col_BlockType{
                                    col1, 
                                    col2, 
                                    col3, 
                                    col4,
                                    col5
                                }
                            }
                        }
                    },                        
                    accordionneo{
                        ... on accordionneo_accordion_BlockType{
                            id,
                            accordionTitle,
                            accordionClasses,
                            accordionmatrix{
                                ... on accordionmatrix_accordionblock_BlockType{
                                    accordionblocktitle,
                                    accordionblockcontent
                                }
                            }
                        }
			        }                                                     
                } 
            }"""

    unitsGraphQlQuery = """ {
                uid
                slug,
                title,
                postDate,
                ... on units_units_Entry {
                    courseName,
                    agreementType {
                        title
                    },
                    contentBlock {
                        ... on contentBlock_contentBlock_BlockType {
                            id,
                            blockTitle,
                            blockContent,
                            contentUsedFor,
                            cssClass,
                            componentIcon {
                                url
                            }
                        }
                    },
                    cmsAsset {
                        ... on cmsAsset_cmsAsset_BlockType {
                            id,
                            assetTitle,
                            assetType,
                            assetUsedFor,
                            assetfile  {
                                url
                            }
                        }
                    },
                    faq{
                        ... on faq_faq_BlockType {
                            id,
                            question,
                            answer
                        }
                    },
                    tip{
                        ... on tip_tip_BlockType {
                            id,
                            tipTitle,
                            tipContent,
                            tipType{
                                title
                            },
                            tipIcon{
                                url
                            },
                            tipCssClass
                        }
                    },
                    table2colMatrix{
                        ... on table2colMatrix_matrix2col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table2col{
                                ... on table2col_BlockType{
                                    col1, 
                                    col2
                                }
                            }                        
                        }
                    },
                    table3colMatrix{
                        ... on table3colMatrix_matrix3col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table3col{
                                ... on table3col_BlockType{
                                    col1, 
                                    col2, 
                                    col3
                                }
                            }
                        }
                    },
                    table4colMatrix{
                        ... on table4colMatrix_matrix4col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table4col{
                                ... on table4col_BlockType{
                                    col1, 
                                    col2, 
                                    col3, 
                                    col4
                                }
                            }
                        }
                    },
                    table5colMatrix{
                        ... on table5colMatrix_matrix5col_BlockType{
                            id,
                            tableClassNames,
                            hasHeaderRow,
                            table5col{
                                ... on table5col_BlockType{
                                    col1, 
                                    col2, 
                                    col3, 
                                    col4,
                                    col5
                                }
                            }
                        }
                    },                    
                    accordionneo{
                        ... on accordionneo_accordion_BlockType{
                            id,
                            accordionTitle,
                            accordionClasses,
                            accordionmatrix{
                                ... on accordionmatrix_accordionblock_BlockType{
                                    accordionblocktitle,
                                    accordionblockcontent
                                }
                            }
                        }
			        }                                                              
                } 
            }"""

    # OpenEdx xblock variabels
    icon_class = 'other'
    display_name = String(default='CI - CMS')

    # CMS Entry Variables
    entryType = String(default='')
    entryUID  = String(default='')
    entrySlug = String(default='')
    entrySections = List(default=[])
    blockOrder = List(default=[])

    cmsApi = 'https://cms.dev.usecreativeintell.com/api'


    def student_view(self, context=None):
        """
        The primary view of the GraphQL CMS XBlock, shown to students
        when viewing courses.
        """

        entry = self.load_selected_entry()

        orderedBlocks = []
        if len(self.blockOrder) > 0 :
            for element in self.blockOrder :
                if '[' not in element and ']' not in element :
                    if element in entry :
                        orderedBlocks.append({
                            'type': element,
                            'block': entry[element]
                        })
                else :
                    elemName = element.split('[')[0]
                    elemId = re.findall(r'\[.*?\]', element)[0].replace('[', '').replace(']', '')
                    if elemName in entry :
                        for subitem in entry[elemName] :
                            if subitem['id'] == elemId : 
                                orderedBlocks.append({
                                    'type': elemName,
                                    'block': subitem
                                })
        else:
            for element in entry:
                if type(entry[element]) is str and entry[element] is not None and element not in 'title,slug,postDate,coursetag':
                     orderedBlocks.append({
                        'type': element,
                        'block': entry[element]
                    })
                if type(entry[element]) is list and len(entry[element]) > 0 and element not in 'coursetag,agreementType':
                    for subItem in entry[element]:
                        orderedBlocks.append({
                            'type': element,
                            'block': subItem
                        })
        
        frag = Fragment()
        html = self.render_template("static/html/graphqlcmsxblock.html", {
            'self':  self, 
            'cmsHost': self.cmsApi.replace('/api', ''),
            'blocks': orderedBlocks
        })
        frag.add_content(html)
        frag.add_css(self.resource_string("static/css/graphqlcmsxblock.css"))
        #frag.initialize_js('GraphQlCmsXBlock')
        return frag


    def studio_view(self, context=None):
        """
        The primary view of the LMS Admin - GraphQL CMS XBlock, shown to Autors
        """

        courseNames = {
            'basicsOfAgreements': 'Basics of Agreements',
            'beatLicenseAgreement': 'Beat License Agreement',
            'beatPurchaseAgreement': 'Beat Purchase Agreement',
            'confidentialityAgreement': 'Confidentiality Agreement',
            'engineerAgreement': 'Engineer Agreement',
            'ipOverviewForTheMusicBusiness': 'IP Overview for the Music Business',
            'lawyerEngagementAgreement': 'Lawyer Engagement Agreement',
            'mixerAgreement': 'Mixer Agreement',
            'musicIndustryOverview': 'Music Industry Overview',
            'producerAgreement': 'Producer Agreement',
            'producerDeclaration': 'Producer Declaration',
            'sideArtistAgreement': 'Side Artist Agreement',
            'songSplitAgreement': 'Song Split Agreement',
            'workForHireAgreementMusic': 'Work For Hire Agreement (Music)'
        }
        
        # Load Clauses
        resp = requests.post(self.cmsApi, json={
            "query": "query MyQuery { entries(section: \"clauses\") {uid, slug, title, \
                    ... on clauses_clause_Entry { courseName } \
                } }"
        })
        clausesList = resp.json()['data']['entries']
        clausesList.sort(key=lambda x: x['title'], reverse=False)

        # Load Courses
        resp = requests.post(self.cmsApi, json={
            "query": "query MyQuery { entries(section: \"courses\") {uid, slug, title \
                    ... on courses_courses_Entry { courseName } \
                } }"
        })
        coursesList = resp.json()['data']['entries']
        coursesList.sort(key=lambda x: x['title'], reverse=False)

        # Load Sections
        resp = requests.post(self.cmsApi, json={
            "query": "query MyQuery { entries(section: \"sections\") {uid, slug, title \
                    ... on sections_sections_Entry { courseName } \
                } }"
        })
        sectionsList = resp.json()['data']['entries']
        sectionsList.sort(key=lambda x: x['title'], reverse=False)

        # Load Units
        resp = requests.post(self.cmsApi, json={
            "query": "query MyQuery { entries(section: \"units\") {uid, slug, title \
                    ... on units_units_Entry { courseName } \
                } }"
        })
        unitsList = resp.json()['data']['entries']
        unitsList.sort(key=lambda x: x['title'], reverse=False)

        # Load Selected Entry [force load all, not only selected]
        entrySections = self.entrySections
        self.entrySections = []
        entry = self.load_selected_entry()
        self.entrySections = entrySections

        # Save UID to memory if previous save had only slug
        if self.entryUID is '' and hasattr(entry, 'uid') and entry['uid'] is not '':
            self.entryUID = entry['uid']

        viewContext = {
            'self': self,
            'cmsHost': self.cmsApi.replace('/api', ''),

            # indexes
            'courseNames': courseNames,
            'clausesList':  clausesList,
            'sectionsList': sectionsList,
            'coursesList':  coursesList,
            'unitsList': unitsList,

            # entry variables
            'entry': entry,
            'entrySections': self.entrySections,
            'blockOrder': self.blockOrder, 

            'assetsBaseUrl': self.runtime.local_resource_url(self, "public/js/studio")
        }

        fragment = Fragment()
        fragment.add_content(self.loader.render_django_template('/studio/html/cmsBlock.html', viewContext))
        fragment.add_css(self.resource_string("studio/css/cmsBlock.css"))
        fragment.initialize_js('CmsBlock')
        return fragment


    def render_template(self, template_path, context={}):
        template_str = self.resource_string(template_path)
        template = Template(template_str)
        return template.render(Context(context))


    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")


    def load_selected_entry(self) :

        entryObj = {}
        if self.entryUID is not None and self.entryUID is not '':
            query = " uid: \"" + self.entryUID +  "\" "
        elif self.entrySlug is not None and self.entrySlug is not '':
            query = " slug: \"" + self.entrySlug +  "\" "
        else:
            return entryObj

        if self.entryType == 'clause':    
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"clauses\", " + query + " limit: 1) " + self.clauseGraphQlQuery + " }"
            })

        elif self.entryType == 'course':    
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"courses\", " + query + " limit: 1) " + self.courseGraphQlQuery + " }"
            })

        elif self.entryType == 'section':    
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"sections\", " + query + " limit: 1) " + self.sectionsGraphQlQuery + " }"
            })

        elif self.entryType == 'unit':    
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"units\", " + query + " limit: 1) " + self.unitsGraphQlQuery + " }"
            })
        
        else :
            # entry type not supported
            entryObj['title'] = 'N/A'
            entryObj['coursetag'] = 'N/A'
            return entryObj
        
        entry = resp.json()['data']['entries'][0]
        
        coursetag = '' 
        if 'coursetag' in entry and len(entry['coursetag']) > 0 :
            coursetag = entry['coursetag'][0]['slug']
        
        if len(self.entrySections) == 0 :
            return entry

        # build object from selected items    
        entryObj['title'] = entry['title']
        entryObj['coursetag'] = coursetag

        for section in self.entrySections : 
            if section in entry :
                entryObj[section] = entry[section]
            
            if '[' in section and ']' in section:
                # Handle Array Items
                elemName = section.split('[')[0]
                elemId = re.findall(r'\[.*?\]', section)[0].replace('[', '').replace(']', '')
                if elemName in entry :
                    for subitem in entry[elemName] :
                        if subitem['id'] == elemId : 
                            if elemName not in entryObj: 
                                entryObj[elemName] = []    
                            entryObj[elemName].append(subitem)
        return entryObj
        

    @XBlock.json_handler
    def save_entry(self, data, suffix):
        self.entryUID       = data['uid']
        self.entrySlug      = data['slug']
        self.display_name   = data['title']
        self.entryType      = data['type']
        self.entrySections  = data['enabledSections']
        self.blockOrder     = data['blockOder']
        return {
            'success': True
        }


    @XBlock.json_handler
    def load_cms_block(self, data, suffix=''):

        if 'clause' in data['type']:
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"clauses\", uid: \"" + data['uid'] + "\" limit: 1) " + self.clauseGraphQlQuery + " }"
            })
            entry = resp.json()['data']['entries'][0]
            return {
                "cmsHost": self.cmsApi.replace('/api', ''),
                "entry": entry
            }

        if 'course' in data['type']:
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"courses\", uid: \"" + data['uid'] + "\" limit: 1) " + self.courseGraphQlQuery + " }"
            })
            entry = resp.json()['data']['entries'][0]
            return {
                "cmsHost": self.cmsApi.replace('/api', ''),
                "entry": entry
            }
        
        if 'section' in data['type']:
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"sections\", uid: \"" + data['uid'] + "\" limit: 1) " + self.sectionsGraphQlQuery + " }"
            })
            entry = resp.json()['data']['entries'][0]
            return {
                "cmsHost": self.cmsApi.replace('/api', ''),
                "entry": entry
            }

        if 'unit' in data['type']:
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"units\", uid: \"" + data['uid'] + "\" limit: 1) " + self.unitsGraphQlQuery + " }"
            })
            entry = resp.json()['data']['entries'][0]
            return {
                "cmsHost": self.cmsApi.replace('/api', ''),
                "entry": entry
            }

        return {}
    

    # TO-DO: change this to create the scenarios you'd like to see in the
    # workbench while developing your XBlock.
    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("GraphQlCmsXBlock",
             """<graphqlcmsxblock/>
             """)
        ]