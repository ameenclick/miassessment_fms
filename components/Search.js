import styles from "../styles/search.module.css"

export default function Search(props){

    function mySearch(input) {
        var input, filter, parant, rowTag, searchTag, i, txtValue;
        filter = input.toUpperCase();
        parant = document.getElementsByTagName(props.mainTag)[0];
        rowTag = parant.getElementsByTagName(props.searchTag);
        for (i = 0; i < rowTag.length; i++) {
            searchTag = rowTag[i].getElementsByTagName(props.innerTag)[props.colIndex];
            txtValue = searchTag.textContent || searchTag.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                rowTag[i].style.display = "";
            } else {
                rowTag[i].style.display = "none";
            }
        }
    }

    return(
        <>
            <input className="form-control form-control-lg" type="text" id={styles.myInput} onChange={(e) => {e.preventDefault(); mySearch(e.target.value)}} placeholder={"Search "+props.keyword+" here.."} title="Type in a name"></input>
        </>
    )
}