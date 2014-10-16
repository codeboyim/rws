define(['helpers/guid'], function(guid) {
    return {
        'risks': [],

        'riskassessmentmethod': [{
                'id': guid(),
                'desc': 'Aerial'
            }, {
                'id': guid(),
                'desc': 'Desktop'
            },

            {
                'id': guid(),
                'desc': 'Physical'
            }
        ],

        'assetcategory': [{
            'id': 'ac-01',
            'desc': 'Economic',
            'code': 'EC'
        }, {
            'id': 'ac-02',
            'desc': 'Human Settlement',
            'code': 'HS'
        }, {
            'id': 'ac-03',
            'desc': 'Environment',
            'code': 'EN'
        }],

        'subrefdata': {
            'ac-01': [{
                'id': 'ac-01-01',
                'desc': 'Agricultural'
            }, {
                'id': 'ac-01-02',
                'desc': 'Commercial/Industrial'
            }],
            'ac-02': [{
                'id': 'ac-02-01',
                'desc': 'Residential'
            }, {
                'id': 'ac-02-02',
                'desc': 'Speicial Risk'
            }, {
                'id': 'ac-02-03',
                'desc': 'Temporary Occupation'
            }],
            'ac-03': [{
                'id': 'ac-03-01',
                'desc': 'Endangered'
            }],
            'ts-01': [{
                'id': guid(),
                'desc': 'Prescribed Burning'
            }, {
                'id': guid(),
                'desc': 'Mechanical Works'
            }, {
                'id': guid(),
                'desc': 'Chemical Works'
            }],
            'ts-02': [{
                'id': guid(),
                'desc': 'Fire Refuge/Safer Place'
            }, {
                'id': guid(),
                'desc': 'Evacuatioin/Relocation Planning'
            }, {
                'id': guid(),
                'desc': 'Fire Management Plan'
            }],
            'ts-03': [{
                'id': guid(),
                'desc': 'School Education Program'
            }, {
                'id': guid(),
                'desc': 'Arson Prevention Campaign'
            }, {
                'id': guid(),
                'desc': 'Bushfire Ready Group'
            }],
            'ts-04': [{
                'id': guid(),
                'desc': 'Treatment Not Required'
            }, {
                'id': guid(),
                'desc': 'Treatment Not Possible'
            }, {
                'id': guid(),
                'desc': 'Unplanned Event'
            }]
        },

        'TreatStrat': [{
            'id': 'ts-01',
            'desc': 'Fule Management'
        }, {
            'id': 'ts-02',
            'desc': 'Planning'
        }, {
            'id': 'ts-03',
            'desc': 'Community Engagement'
        }, {
            'id': 'ts-04',
            'desc': 'Other'
        }, ],

        'Treatmgr': [{
            'id': guid(),
            'desc': 'DFES'
        }, {
            'id': guid(),
            'desc': 'Local Government'
        }],

        'bmz': [{
            'id': guid(),
            'desc': 'Asset Protection Zone'
        }, {
            'id': guid(),
            'desc': 'Land Management Zone'
        }],

        'notetype': [{
            'id': guid(),
            'desc': 'Issue'
        }, {
            'id': guid(),
            'desc': 'Decision'
        }, {
            'id': guid(),
            'desc': 'Feedback'
        }],

        'notestat': [{
            'id': guid(),
            'desc': 'Open'
        }, {
            'id': guid(),
            'desc': 'Closed'
        }],

        'vegetationclass': [{
            'id': 'vc-01',
            'desc': 'Open Forest',
            'age': [{
                'id': guid(),
                'desc': '20'
            }],
            'canopy': [{
                'id': guid(),
                'desc': 'N/A'
            }]
        }, {
            'id': 'vc-02',
            'desc': 'Closed Scrub',
            'age': [{
                'id': guid(),
                'desc': '5'
            }, {
                'id': guid(),
                'desc': '10'
            }, {
                'id': guid(),
                'desc': '20'
            }],
            'canopy': [{
                'id': guid(),
                'desc': '20'
            }, {
                'id': guid(),
                'desc': '40'
            }, {
                'id': guid(),
                'desc': '50'
            }]
        }, {
            'id': 'vc-03',
            'desc': 'Woodland',
            'age': [{
                'id': guid(),
                'desc': '5'
            }, {
                'id': guid(),
                'desc': '10'
            }, {
                'id': guid(),
                'desc': '15'
            }],
            'canopy': [{
                'id': guid(),
                'desc': '20'
            }, {
                'id': guid(),
                'desc': '40'
            }, {
                'id': guid(),
                'desc': '50'
            }, {
                'id': guid(),
                'desc': '80'
            }]
        }],

        'separation': [{
            'id': guid(),
            'desc': '<=10',
            'code': '10'
        }, {
            'id': guid(),
            'desc': '>10 & <=20',
            'code': '20'
        }, {
            'id': guid(),
            'desc': '> 20',
            'code': '30'
        }],

        'vulnerab': [{
            'id': guid(),
            'desc': 'Low',
            'code': '1'
        }, {
            'id': guid(),
            'desc': 'Moderate',
            'code': '2'
        }, {
            'id': guid(),
            'desc': 'High',
            'code': '3'
        }],

        'impactlvl': [{
            'id': guid(),
            'desc': 'Local',
            'code': '1'
        }, {
            'id': guid(),
            'desc': 'Regional',
            'code': '2'
        }],

        'recocost': [{
            'id': guid(),
            'desc': 'Low',
            'code': '1'
        }, {
            'id': guid(),
            'desc': 'Moderate',
            'code': '2'
        }, {
            'id': guid(),
            'desc': 'High',
            'code': '3'
        }],

        'conservst': [{
            'id': guid(),
            'desc': 'Locally Important',
            'code': '1'
        }, {
            'id': guid(),
            'desc': 'Vulnerable',
            'code': '2'
        }, {
            'id': guid(),
            'desc': 'Endangered',
            'code': '3'
        }],

        'geoextent': [{
            'id': guid(),
            'desc': 'Widespread',
            'code': '1'
        }, {
            'id': guid(),
            'desc': 'Restricted',
            'code': '2'
        }, {
            'id': guid(),
            'desc': 'Highly Restricted',
            'code': '3'
        }],

        'fireimpact': [{
            'id': guid(),
            'desc': 'No Conditions',
            'code': '1'
        }, {
            'id': guid(),
            'desc': 'Restrict',
            'code': '2'
        }, {
            'id': guid(),
            'desc': 'Exclude',
            'code': '3'
        }]
    };

});
