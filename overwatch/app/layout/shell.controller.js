(function () {
    'use strict';

    angular
        .module('app.layout')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['common', '$rootScope', '$state', 'leaderBoardService'];

    /* @ngInject */
    function ShellController(common, $rootScope, $state, leaderBoardService) {
        /* jshint validthis: true */
        var vm = this;
        var logger = common.logger;

        vm.activate = activate;
        vm.title = 'ShellController';
        vm.showMessage = false;
        vm.profile = [];
        vm.mouseOver = false;

        vm.showSpinner = false;
        vm.spinnerMessage = 'Retrieving data...';
        vm.spinnerOptions = {
            radius: 40,
            lines: 8,
            length: 0,
            width: 30,
            speed: 1.7,
            corners: 1.0,
            trail: 100,
            color: '#428bca'
        };
        
        vm.searchBattleTag = searchBattleTag;

        activate();

        ////////////////

        function activate() {
            logger.log('Crnt loaded!', false);
            
            // return crntUserService.login().then(function (data) {
            //     $rootScope.crntUser = data;
            // })
        }
        
        function searchBattleTag(name){
            if (!name) {
                return
            }
            else {
                var userId = escapeHtml(name)
                getList(userId);
            }

        }

        function escapeHtml(text) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;',
                '#': '%23'
            };

            return text.replace(/[&<>"'#]/g, function (m) { return map[m]; });
        }

        $rootScope.$on('spinner.toggle', function (event, args) {
            vm.showSpinner = args.show;
            if (args.message) {
                vm.spinnerMessage = args.message;
            }
        });


        /* Calling Data Service */
        function getList(userId) {
            var user = userId;
            user = user.replace(/\s/g, '');
            leaderBoardService.getSearchForProfile(user)
                .then(function (data) {
                    if (!data) {
                        vm.showMessage = true;
                    }
                    else {
                        vm.profile = data.profile;
                        vm.showMessage = false;
                        var oldstr = data.profile.name;
                        var userId = oldstr.replace("#", "-");
                        $state.go('home.mystats', { platform: data.profile.platform, region: data.profile.region, userId: userId });
                    }

                });
        }

    }
})();