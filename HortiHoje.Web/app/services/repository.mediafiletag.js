﻿(function () {
    'use strict';

    var serviceId = 'repository.mediafiletag';
    angular.module('app').factory(serviceId,
        ['model', 'repository.abstract', RepositoryMediaFileTag]);

    function RepositoryMediaFileTag(model, AbstractRepository) {
        var Predicate = breeze.Predicate;
        var entityName = model.entityNames.mediaFileTag;
        var EntityQuery = breeze.EntityQuery;

        function Ctor(mgr) {
            this.serviceId = serviceId;
            this.entityName = entityName;
            this.manager = mgr;

            // Exposed data access functions
            this.attach = attach;
            this.create = create;
            this.getCount = getCount;
            this.getPartials = getPartials;
        }

        AbstractRepository.extend(Ctor);

        return Ctor;

        // Attach New mft
        function attach(mft) {
            return this.manager.attachEntity(mft);
        }

        // Create
        function create(initValues) {
            return this.manager.createEntity(entityName, initValues);
        }
        // getMediaFileCount
        function getCount() {
            var self = this;

            return self.$q.when(self._getLocalCount(entityName));
        }


        // getMediaFilePartials
        function getPartials(forceRefresh) {
            var self = this;
            var files;

            if (!forceRefresh) {
                files = self._getAllLocal(entityName, orderBy);
                return self.$q.when(files);
            }

            return EntityQuery.from('MediaFileTag')
                .select('*')
                .toType(entityName)
                .using(self.manager).execute()
                .to$q(querySucceeded, self._queryFailed);

            function querySucceeded(data) {
                files = data.results;
                self.log('Retrieved [MediaFileTag Partials] from remote data source', files.length, true);
                return files;
            }
        }
    }
})();