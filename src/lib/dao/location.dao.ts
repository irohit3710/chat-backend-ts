import locationModel from "../../models/location.model";

export class LocationDao{
    static async setLocation(payload:any){
        return await locationModel.create(payload);
    }

    static async getNearbyUsers(latitude:any,longitude:any){
        return await  locationModel.aggregate([
            {
                $geoNear:{
                    near:{
                        type:'Point',
                        coordinates:[longitude, latitude]
                    },
                    distanceField:'distance',
                    maxDistance: 500,
                    spherical: true
                }
            }
        ])
    }
}