﻿(function () {
    'use strict';

    var serviceId = 'repository.reporter';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', RepositoryReporter]);

    function RepositoryReporter(model, AbstractRepository) {
        var Predicate = breeze.Predicate;
        var entityName = model.entityNames.reporter;
        var EntityQuery = breeze.EntityQuery;
        var orderBy = 'name, nIF';

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;
            this.getById = getById;

            // Exposed data access functions
            this.doLogin = doLogin;
            this.getCount = getCount;
            this.getPartials = getPartials;
            this.getAllExcept = getAllExcept;

        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        // doLogin
        function doLogin(userName, pw) {
            var self = this;

            if (userName === undefined ||
                pw === undefined)
                return $q.when();

            var unamePred = Predicate('userName', '==', userName);
            var pwPred = Predicate('passwordHash', '==', pw);

            return EntityQuery.from('Reporters')
                .where(unamePred.and(pwPred))
                .toType(entityName)
                .using(self.manager).execute()
                .to$q(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                return data.results[0];
            }

        }

        // getReporterCount
        function getCount() {
            var self = this;
            return self.$q.when(self._getLocalCount(entityName));
        }

        // get Repository by id
        function getById(id, forceRemote) {
            return this._getById(entityName, id, forceRemote);
        }


        // Formerly known as datacontext.getReporterPartials()
        function getPartials(forceRefresh) {
            var self = this;
            var reporters;

            if (!forceRefresh) {
                reporters = self._getAllLocal(entityName, orderBy);
                return self.$q.when(reporters);
            }

            return EntityQuery.from('Reporters')
                .select('userName, name, passwordHash, doB, nIF, address, isManager')
                .orderBy(orderBy)
                .toType(entityName)
                .using(self.manager).execute()
                .to$q(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                reporters = data.results;
                self.log('Retrieved [Reporter Partials] from remote data source', reporters.length, true);
                return reporters;
            }
        }

        // Get All Reporters Except One
        function getAllExcept(idReporter) {
            var self = this;
            var pred = Predicate("id", "!=", idReporter);

            return EntityQuery.from('Reporters')
                .where(pred)
                .using(self.manager).executeLocally();
        }
    }
})();