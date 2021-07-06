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

class GraphQlCmsXBlock(XBlock):

    clauseGraphQlQuery = """ {
                slug,
                title,
                postDate,
                ... on clauses_clause_Entry {
                    coursetag {
                        slug
                    },
                    agreementType {
                        title
                    },
                    clauseText,
                    lmsText,
                    lmsAdvancedConcepts,
                    platformText,
                    platformAdvancedConcepts,
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
                    accordionmatrix{
                        ... on accordionmatrix_accordionblock_BlockType{
                            id, 
                            accordionblocktitle, 
                            accordionblockcontent
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
                slug,
                title,
                postDate,
                ... on courses_courses_Entry {
                    coursetag {
                        slug
                    },
                    agreementType {
                        title
                    },
                    contentBlock {
                        ... on contentBlock_contentBlock_BlockType {
                            id,
                            blockTitle,
                            blockContent,
                            contentUsedFor
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
                    accordionmatrix{
                        ... on accordionmatrix_accordionblock_BlockType{
                            id, 
                            accordionblocktitle, 
                            accordionblockcontent
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

    lessonGraphQlQuery = """{
                slug,
                title,
                postDate,
                ... on lessons_lesson_Entry {
                    coursetag {
                        slug
                    },
                    agreementType {
                        title
                    },
                    contentBlock {
                        ... on contentBlock_contentBlock_BlockType {
                            id,
                            blockTitle,
                            blockContent,
                            contentUsedFor
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
                    accordionmatrix{
                        ... on accordionmatrix_accordionblock_BlockType{
                            id, 
                            accordionblocktitle, 
                            accordionblockcontent
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

    pageGraphQlQuery = """ {
                slug,
                title,
                postDate,
                ... on pages_page_Entry {
                    coursetag {
                        slug
                    },
                    agreementType {
                        title
                    },
                    contentBlock {
                        ... on contentBlock_contentBlock_BlockType {
                            id,
                            blockTitle,
                            blockContent,
                            contentUsedFor
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
                    accordionmatrix{
                        ... on accordionmatrix_accordionblock_BlockType{
                            id, 
                            accordionblocktitle, 
                            accordionblockcontent
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


    # Fields are defined on the class.  You can access them in your code as
    # self.<fieldname>.
    entryType = String(
        default=''
    )

    entrySlug = String(
        default=''
    )

    entrySections = List(
        default=[]
    )

    cmsApi = 'https://dev.cms.intellcreative.ca/api'

    icon_class = 'other'

    def student_view(self, context=None):
        """
        The primary view of the GraphQL CMS XBlock, shown to students
        when viewing courses.
        """

        entry = {
            'title': '',
            'sections': [],
            'contentBlocks': [],
            'assets': [],
            'faqs': [],
            'tips': [],
            'tables2': [],
            'tables3': [],
            'tables4': [],
            'accordions': [],
            'accordionneo': []
        }

        if self.entrySlug is not '':
            entry = self.load_selected_entry()
            

        frag = Fragment()
        html = self.render_template("static/html/graphqlcmsxblock.html", {
            'self':  self, 
            'cmsHost': self.cmsApi.replace('/api', ''),
            'title': entry['title'],
            'sections': entry['sections'],
            'contentBlocks': entry['contentBlocks'],
            'assets': entry['assets'],
            'faqs': entry['faqs'],
            'tips': entry['tips'],
            'tables2': entry['tables2'],
            'tables3': entry['tables3'],
            'tables4': entry['tables4'],
            'accordions': entry['accordions'],
            'accordionneo': entry['accordionneo']
        })
        frag.add_content(html)
        frag.add_css(self.resource_string("static/css/graphqlcmsxblock.css"))
        frag.add_javascript(self.resource_string("static/js/src/graphqlcmsxblock.js"))
        frag.initialize_js('GraphQlCmsXBlock')
        return frag


    def studio_view(self, context=None):
        """
        The primary view of the LMS Admin - GraphQL CMS XBlock, shown to Autors
        """

        # Load Course Top Filter
        resp =  requests.post(self.cmsApi, json={
            "query": "query MyQuery { tags(group: \"coursetag\", limit: 30) {slug, title} }"
        })
        courseTags = resp.json()['data']['tags']
        courseTags.sort(key=lambda x: x['title'], reverse=False)


        # Load Clauses
        resp = requests.post(self.cmsApi, json={
            "query": "query MyQuery { entries(section: \"clauses\") {slug, title, \
                    ... on clauses_clause_Entry { coursetag { slug } } \
                } }"
        })
        clauses = resp.json()['data']['entries']
        clauses.sort(key=lambda x: x['title'], reverse=False)

        # Load Courses
        resp = requests.post(self.cmsApi, json={
            "query": "query MyQuery { entries(section: \"courses\") {slug, title \
                    ... on courses_courses_Entry { coursetag { slug } } \
                } }"
        })
        courses = resp.json()['data']['entries']
        courses.sort(key=lambda x: x['title'], reverse=False)

        # Load Lessons
        resp = requests.post(self.cmsApi, json={
            "query": "query MyQuery { entries(section: \"lessons\") {slug, title \
                    ... on lessons_lesson_Entry { coursetag { slug } } \
                } }"
        })
        lessons = resp.json()['data']['entries']
        lessons.sort(key=lambda x: x['title'], reverse=False)

        # Load Pages
        resp = requests.post(self.cmsApi, json={
            "query": "query MyQuery { entries(section: \"pages\") {slug, title \
                    ... on pages_page_Entry { coursetag { slug } } \
                } }"
        })
        pages = resp.json()['data']['entries']
        pages.sort(key=lambda x: x['title'], reverse=False)
        
        # Load Selected Entry
        entry = {
            'coursetag': [],
            'title': '',
            'sections': [],
            'contentBlocks': [],
            'assets': [],
            'faqs': [],
            'tips': [],
            'tables2': [],
            'tables3': [],
            'tables4': [],
            'accordions': [],
            'accordionneo': []
        }
        if self.entrySlug is not '':
            entry = self.load_selected_entry()
        
        frag = Fragment()
        html = self.render_template("studio/html/cmsBlock.html", {
                'self': self,
                'courseTags': courseTags,
                'clauses':  clauses,
                'lessons': lessons,
                'courses':  courses,
                'pages': pages,
                'selectedCourseTag': entry['coursetag'],
                'title': entry['title'],
                'sections': entry['sections'],
                'contentBlocks': entry['contentBlocks'],
                'assets': entry['assets'],
                'faqs': entry['faqs'],
                'tips': entry['tips'],
                'tables2': entry['tables2'],
                'tables3': entry['tables3'],
                'tables4': entry['tables4'],
                'accordions': entry['accordions'],
                'accordionneo': entry['accordionneo']
            })
        frag.add_content(html)
        frag.add_css(self.resource_string("studio/css/cmsBlock.css"))
        frag.add_javascript(self.resource_string("studio/js/cmsBlock.js"))
        frag.initialize_js('CmsBlock')
        return frag


    def render_template(self, template_path, context={}):
        template_str = self.resource_string(template_path)
        template = Template(template_str)
        return template.render(Context(context))


    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def load_selected_entry(self) :
        title = ''
        sections = []
        contentBlocks = []
        assets = []
        faqs = []
        tips = []
        tables2 = []
        tables3 = []
        tables4 = []
        accordions = []
        accordionneo = []

        if self.entryType == 'clause':    
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"clauses\", slug: \"" + self.entrySlug + "\" limit: 1) " + self.clauseGraphQlQuery + " }"
            })

        elif self.entryType == 'course':    
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"courses\", slug: \"" + self.entrySlug + "\" limit: 1) " + self.courseGraphQlQuery + " }"
            })
        
        elif self.entryType == 'page':    
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"pages\", slug: \"" + self.entrySlug + "\" limit: 1) " + self.pageGraphQlQuery + " }"
            })
        
        entry = resp.json()['data']['entries'][0]
        title = entry['title']
        
        coursetag = '' 
        if 'coursetag' in entry and len(entry['coursetag']) > 0 :
            coursetag = entry['coursetag'][0]['slug']

        if len(self.entrySections) > 0 :
            for section in self.entrySections : 
                if section in entry :
                    sections.append(entry[section])
                
                elif '[' in section :
                    # Handle Array Items (Assets)
                    elemName = section.split('[')[0]
                    elemId = re.findall(r'\[.*?\]', section)[0].replace('[', '').replace(']', '')
                    if elemName in entry :
                        for subitem in entry[elemName] :
                            if subitem['id'] == elemId : 
                                if 'contentBlock' in section:
                                    contentBlocks.append(subitem)
                                elif 'cmsAsset' in section :
                                    assets.append(subitem)
                                elif 'faq' in section :
                                    faqs.append(subitem)
                                elif 'tip' in section :
                                    tips.append(subitem)
                                elif 'table2colMatrix' in section:
                                    tables2.append(subitem)
                                elif 'table3colMatrix' in section:
                                    tables3.append(subitem)
                                elif 'table4colMatrix' in section:
                                    tables4.append(subitem)
                                elif 'accordionmatrix' in section:
                                    accordions.append(subitem)
                                elif 'accordionneo' in section:
                                    accordionneo.append(subitem)
                                
        else: 
            for section in entry :
                if (type(entry[section])) == str and section not in ['slug', 'title', 'postDate', 'contentBlock', 'cmsAsset', 'faq', 'tip'] :
                    sections.append(entry[section])
                elif 'contentBlock' in section:
                    for subitem in entry[section] :
                        contentBlocks.append(subitem)
                elif 'cmsAsset' in section :
                    for subitem in entry[section] :
                        assets.append(subitem)
                elif 'faq' in section :
                    for subitem in entry[section] :
                        faqs.append(subitem)
                elif 'tip' in section :
                    for subitem in entry[section] :
                        tips.append(subitem)
                elif 'table2colMatrix' in section :
                    for subitem in entry[section] :
                        tables2.append(subitem)
                elif 'table3colMatrix' in section :
                    for subitem in entry[section] :
                        tables3.append(subitem)
                elif 'table4colMatrix' in section :
                    for subitem in entry[section] :
                        tables4.append(subitem)
                elif 'accordionmatrix' in section :
                    for subitem in entry[section] :
                        accordions.append(subitem)
                elif 'accordionneo' in section :
                    for subitem in entry[section] :
                        accordionneo.append(subitem)

        return {
            'title': title,
            'coursetag': coursetag,
            'sections': sections,
            'contentBlocks': contentBlocks,
            'assets': assets,
            'faqs': faqs,
            'tips': tips,
            'tables2': tables2,
            'tables3': tables3,
            'tables4': tables4,
            'accordions': accordions,
            'accordionneo' : accordionneo
        }

    @XBlock.json_handler
    def select_cms_block(self, data, suffix=''):
        """
        An example handler, which increments the data.
        """

        # Reset
        self.entryType = ''
        self.entrySlug = ''
        self.entrySections = []

        if 'clause' in data:
            self.entryType = 'clause'
            self.entrySlug = data['clause']
            self.entrySections = []
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"clauses\", slug: \"" + self.entrySlug + "\" limit: 1) " + self.clauseGraphQlQuery + " }"
            })
            entry = resp.json()['data']['entries'][0]
            return {
                "cmsHost": self.cmsApi.replace('/api', ''),
                "entry": entry
            }

        if 'course' in data:
            self.entryType = 'course'
            self.entrySlug = data['course']
            self.entrySections = []
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"courses\", slug: \"" + self.entrySlug + "\" limit: 1) " + self.courseGraphQlQuery + " }"
            })
            entry = resp.json()['data']['entries'][0]
            return {
                "cmsHost": self.cmsApi.replace('/api', ''),
                "entry": entry
            }
        
        if 'lesson' in data:
            self.entryType = 'lesson'
            self.entrySlug = data['lesson']
            self.entrySections = []
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"lessons\", slug: \"" + self.entrySlug + "\" limit: 1) " + self.lessonGraphQlQuery + " }"
            })
            entry = resp.json()['data']['entries'][0]
            return {
                "cmsHost": self.cmsApi.replace('/api', ''),
                "entry": entry
            }

        if 'page' in data:
            self.entryType = 'page'
            self.entrySlug = data['page']
            self.entrySections = []
            resp = requests.post(self.cmsApi, json={
                "query": "query MyQuery {entries(section: \"pages\", slug: \"" + self.entrySlug + "\" limit: 1) " + self.pageGraphQlQuery + " }"
            })
            entry = resp.json()['data']['entries'][0]
            return {
                "cmsHost": self.cmsApi.replace('/api', ''),
                "entry": entry
            }

        return {}
    
    @XBlock.json_handler
    def select_cms_block_subsections(self, data, suffix=''):
        if 'type' in data:
            entrySections = []
            for section in data['selected']: 
                entrySections.append(section['name'])
            self.entrySections = entrySections
            return {'result': 'success', 'selected': self.entrySections}
        
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