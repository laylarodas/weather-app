import { countries } from "../../data/countries"
import styles from './Form.module.css'


export const Form = () => {
  return (
    <form className={styles.form}>
        <div className={styles.field}>
            <label htmlFor="city">City: </label>
            <input type="text" id="city" name="city" placeholder="City"/>
        </div>
        <div className={styles.field}>
            <label htmlFor="city">Country: </label>
            <select>
                <option className={styles.options} value=""> -- Select a Country -- </option>
                {
                    countries.map(country => (
                        <option  className={styles.options} key={country.code} value={country.code}>{country.name}</option>
                    ))
                }
            </select>
        </div>

        <input className={styles.submit} type="submit" value='Check weather'/>
    </form>
  )
}
