import React, { useEffect } from 'react'
import style from './index.module.scss'
import { getRatings } from '../../api'
const PersonalDetails = () => {

    const [data, setData] = React.useState(
        {
            favPark: "kiki", weekAmount: "200",
            yearAmount: "500", monthAmount: "320",
            mostRated: "Balablu", leastRated: "Town hall"
        }
    )


    useEffect(() => {
        const getRatingsData = async () => {
            const res = await getRatings();
            console.log(res.data)
        };
        getRatingsData()
    }, [])
    return (
        <div className={style.PersonalDetails}>
            <div className={style.PersonalDetails__stats}>
                <h2 className={style.PersonalDetails__stats__header}>Stats</h2>
                <h2 className={style.PersonalDetails__stats__data}>Favourite Park <p>{data?.favPark}</p></h2>
                <h2 className={style.PersonalDetails__stats__header}>Amount Spent on Parking </h2>
                <h3 className={style.PersonalDetails__stats__data}>week 20/03/2023 <p>${data?.weekAmount}</p></h3>
                <h3 className={style.PersonalDetails__stats__data}>month Apr <p>${data?.monthAmount}</p></h3>
                <h3 className={style.PersonalDetails__stats__data}>Year 2023<p>${data?.yearAmount}</p></h3>
                <h2 className={style.PersonalDetails__stats__header}>Other Stats </h2>
                <h3 className={style.PersonalDetails__stats__data}>Most Rated Park<p>{data?.mostRated}</p></h3>
                <h3 className={style.PersonalDetails__stats__data}>Least Rated Park<p>{data?.leastRated}</p></h3>
            </div>
        </div>
    )
}

export default PersonalDetails